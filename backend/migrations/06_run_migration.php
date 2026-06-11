<?php
/**
 * Run lectures table updates migration
 * Run via: php backend/migrations/06_run_migration.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    echo "Connecting to the database...\n";
    $db = Database::getConnection();

    echo "Checking lectures table structure...\n";
    
    // Check if lectures table exists
    $tableCheck = $db->query("SHOW TABLES LIKE 'lectures'");
    if ($tableCheck->rowCount() == 0) {
        throw new Exception("Error: 'lectures' table does not exist.");
    }

    $statusExists = false;

    $columns = $db->query("SHOW COLUMNS FROM `lectures`")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($columns as $column) {
        if ($column === 'status') {
            $statusExists = true;
        }
    }

    if (!$statusExists) {
        echo "Adding column 'status' to lectures...\n";
        $db->exec("ALTER TABLE `lectures` ADD COLUMN `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft' AFTER `sort_order`");
        echo "Column 'status' added successfully.\n";
    } else {
        echo "Column 'status' already exists.\n";
    }

    // Check indexes
    $indexes = $db->query("SHOW INDEX FROM `lectures`")->fetchAll(PDO::FETCH_ASSOC);
    $moduleSortIndexExists = false;
    $moduleStatusIndexExists = false;

    foreach ($indexes as $index) {
        if ($index['Key_name'] === 'idx_lectures_module_sort') {
            $moduleSortIndexExists = true;
        }
        if ($index['Key_name'] === 'idx_lectures_module_status') {
            $moduleStatusIndexExists = true;
        }
    }

    if (!$moduleSortIndexExists) {
        echo "Adding index 'idx_lectures_module_sort'...\n";
        $db->exec("ALTER TABLE `lectures` ADD INDEX `idx_lectures_module_sort` (`module_id`, `sort_order`)");
        echo "Index 'idx_lectures_module_sort' added successfully.\n";
    } else {
        echo "Index 'idx_lectures_module_sort' already exists.\n";
    }

    if (!$moduleStatusIndexExists) {
        echo "Adding index 'idx_lectures_module_status'...\n";
        $db->exec("ALTER TABLE `lectures` ADD INDEX `idx_lectures_module_status` (`module_id`, `status`)");
        echo "Index 'idx_lectures_module_status' added successfully.\n";
    } else {
        echo "Index 'idx_lectures_module_status' already exists.\n";
    }

    echo "Migration 06 applied successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
