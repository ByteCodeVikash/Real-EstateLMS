<?php
/**
 * Migration 07: Audit and update enrollments table schema
 * Add status, enrolled_at, completed_at, created_at, updated_at columns
 * Setup sync triggers
 * Run via: php backend/migrations/07_run_migration.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    echo "Connecting to the database...\n";
    $db = Database::getConnection();

    // Check if table enrollments exists
    $tableCheck = $db->query("SHOW TABLES LIKE 'enrollments'");
    if ($tableCheck->rowCount() == 0) {
        throw new Exception("Error: 'enrollments' table does not exist.");
    }

    echo "Checking enrollments table columns...\n";
    $columns = $db->query("SHOW COLUMNS FROM `enrollments`")->fetchAll(PDO::FETCH_COLUMN);

    // 1. Add status ENUM
    if (!in_array('status', $columns)) {
        echo "Adding column 'status' to enrollments...\n";
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `status` ENUM('Active', 'Completed', 'Dropped') DEFAULT 'Active' AFTER `course_id`");
        // Backfill status
        $db->exec("UPDATE `enrollments` SET `status` = `completion_status` WHERE `completion_status` IS NOT NULL");
        echo "Column 'status' added and populated.\n";
    } else {
        echo "Column 'status' already exists.\n";
    }

    // 2. Add enrolled_at
    if (!in_array('enrolled_at', $columns)) {
        echo "Adding column 'enrolled_at' to enrollments...\n";
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `status`");
        // Backfill enrolled_at
        $db->exec("UPDATE `enrollments` SET `enrolled_at` = `enrollment_date` WHERE `enrollment_date` IS NOT NULL");
        echo "Column 'enrolled_at' added and populated.\n";
    } else {
        echo "Column 'enrolled_at' already exists.\n";
    }

    // 3. Add completed_at
    if (!in_array('completed_at', $columns)) {
        echo "Adding column 'completed_at' to enrollments...\n";
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `completed_at` TIMESTAMP NULL DEFAULT NULL AFTER `enrolled_at`");
        // Backfill completed_at
        $db->exec("UPDATE `enrollments` SET `completed_at` = `enrollment_date` WHERE `completion_status` = 'Completed'");
        echo "Column 'completed_at' added and populated.\n";
    } else {
        echo "Column 'completed_at' already exists.\n";
    }

    // 4. Add created_at
    if (!in_array('created_at', $columns)) {
        echo "Adding column 'created_at' to enrollments...\n";
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `progress`");
        // Backfill created_at
        $db->exec("UPDATE `enrollments` SET `created_at` = `enrollment_date` WHERE `enrollment_date` IS NOT NULL");
        echo "Column 'created_at' added and populated.\n";
    } else {
        echo "Column 'created_at' already exists.\n";
    }

    // 5. Add updated_at
    if (!in_array('updated_at', $columns)) {
        echo "Adding column 'updated_at' to enrollments...\n";
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`");
        echo "Column 'updated_at' added.\n";
    } else {
        echo "Column 'updated_at' already exists.\n";
    }

    // 6. Set up indexes
    // Note: uk_user_course, idx_enrollments_user, idx_enrollments_course already exist, but let's check or create.
    $indexes = $db->query("SHOW INDEX FROM `enrollments`")->fetchAll(PDO::FETCH_ASSOC);
    $idxUserExists = false;
    $idxCourseExists = false;
    foreach ($indexes as $index) {
        if ($index['Key_name'] === 'idx_enrollments_user') {
            $idxUserExists = true;
        }
        if ($index['Key_name'] === 'idx_enrollments_course') {
            $idxCourseExists = true;
        }
    }
    if (!$idxUserExists) {
        echo "Adding index idx_enrollments_user...\n";
        $db->exec("ALTER TABLE `enrollments` ADD INDEX `idx_enrollments_user` (`user_id`)");
    }
    if (!$idxCourseExists) {
        echo "Adding index idx_enrollments_course...\n";
        $db->exec("ALTER TABLE `enrollments` ADD INDEX `idx_enrollments_course` (`course_id`)");
    }

    // 7. Install sync triggers
    echo "Dropping old triggers if they exist...\n";
    $db->exec("DROP TRIGGER IF EXISTS `before_insert_enrollments`");
    $db->exec("DROP TRIGGER IF EXISTS `before_update_enrollments`");

    echo "Creating triggers to sync old/new fields...\n";
    $db->exec("
        CREATE TRIGGER `before_insert_enrollments`
        BEFORE INSERT ON `enrollments`
        FOR EACH ROW
        BEGIN
            -- Sync status & completion_status
            IF NEW.`status` = 'Active' AND NEW.`completion_status` != 'Active' THEN
                SET NEW.`status` = NEW.`completion_status`;
            ELSEIF NEW.`completion_status` = 'Active' AND NEW.`status` != 'Active' THEN
                SET NEW.`completion_status` = NEW.`status`;
            END IF;
            
            -- Sync enrolled_at & enrollment_date
            IF NEW.`enrolled_at` = CURRENT_TIMESTAMP AND NEW.`enrollment_date` != CURRENT_TIMESTAMP THEN
                SET NEW.`enrolled_at` = NEW.`enrollment_date`;
            ELSEIF NEW.`enrollment_date` = CURRENT_TIMESTAMP AND NEW.`enrolled_at` != CURRENT_TIMESTAMP THEN
                SET NEW.`enrollment_date` = NEW.`enrolled_at`;
            END IF;

            -- Auto-set completed_at
            IF NEW.`status` = 'Completed' AND NEW.`completed_at` IS NULL THEN
                SET NEW.`completed_at` = CURRENT_TIMESTAMP;
            END IF;
        END;
    ");

    $db->exec("
        CREATE TRIGGER `before_update_enrollments`
        BEFORE UPDATE ON `enrollments`
        FOR EACH ROW
        BEGIN
            -- Sync status & completion_status updates
            IF NEW.`completion_status` <> OLD.`completion_status` THEN
                SET NEW.`status` = NEW.`completion_status`;
            ELSEIF NEW.`status` <> OLD.`status` THEN
                SET NEW.`completion_status` = NEW.`status`;
            END IF;

            -- Manage completed_at based on status changes
            IF NEW.`status` = 'Completed' AND (OLD.`status` IS NULL OR OLD.`status` <> 'Completed') THEN
                SET NEW.`completed_at` = CURRENT_TIMESTAMP;
            ELSEIF NEW.`status` <> 'Completed' THEN
                SET NEW.`completed_at` = NULL;
            END IF;

            -- Sync enrolled_at & enrollment_date updates
            IF NEW.`enrollment_date` <> OLD.`enrollment_date` THEN
                SET NEW.`enrolled_at` = NEW.`enrollment_date`;
            ELSEIF NEW.`enrolled_at` <> OLD.`enrolled_at` THEN
                SET NEW.`enrollment_date` = NEW.`enrolled_at`;
            END IF;
        END;
    ");

    echo "Triggers installed successfully.\n";
    echo "Migration 07 applied successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
