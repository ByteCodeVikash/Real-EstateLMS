<?php
/**
 * Run course_modules table updates migration
 * Run via: php backend/migrations/05_run_migration.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    echo "Connecting to the database...\n";
    $db = Database::getConnection();

    echo "Checking course_modules table structure...\n";
    
    // Check if course_modules table exists
    $tableCheck = $db->query("SHOW TABLES LIKE 'course_modules'");
    if ($tableCheck->rowCount() == 0) {
        throw new Exception("Error: 'course_modules' table does not exist.");
    }

    $statusExists = false;
    $updatedAtExists = false;

    $columns = $db->query("SHOW COLUMNS FROM `course_modules`")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($columns as $column) {
        if ($column === 'status') {
            $statusExists = true;
        }
        if ($column === 'updated_at') {
            $updatedAtExists = true;
        }
    }

    if (!$statusExists) {
        echo "Adding column 'status' to course_modules...\n";
        $db->exec("ALTER TABLE `course_modules` ADD COLUMN `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft' AFTER `sort_order`");
        echo "Column 'status' added successfully.\n";
    } else {
        echo "Column 'status' already exists.\n";
    }

    if (!$updatedAtExists) {
        echo "Adding column 'updated_at' to course_modules...\n";
        $db->exec("ALTER TABLE `course_modules` ADD COLUMN `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`");
        echo "Column 'updated_at' added successfully.\n";
    } else {
        echo "Column 'updated_at' already exists.\n";
    }

    // Check indexes
    $indexes = $db->query("SHOW INDEX FROM `course_modules`")->fetchAll(PDO::FETCH_ASSOC);
    $courseSortIndexExists = false;
    $courseStatusIndexExists = false;

    foreach ($indexes as $index) {
        if ($index['Key_name'] === 'idx_modules_course_sort') {
            $courseSortIndexExists = true;
        }
        if ($index['Key_name'] === 'idx_modules_course_status') {
            $courseStatusIndexExists = true;
        }
    }

    if (!$courseSortIndexExists) {
        echo "Adding index 'idx_modules_course_sort'...\n";
        $db->exec("ALTER TABLE `course_modules` ADD INDEX `idx_modules_course_sort` (`course_id`, `sort_order`)");
        echo "Index 'idx_modules_course_sort' added successfully.\n";
    } else {
        echo "Index 'idx_modules_course_sort' already exists.\n";
    }

    if (!$courseStatusIndexExists) {
        echo "Adding index 'idx_modules_course_status'...\n";
        $db->exec("ALTER TABLE `course_modules` ADD INDEX `idx_modules_course_status` (`course_id`, `status`)");
        echo "Index 'idx_modules_course_status' added successfully.\n";
    } else {
        echo "Index 'idx_modules_course_status' already exists.\n";
    }

    echo "Migration 05 applied successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
