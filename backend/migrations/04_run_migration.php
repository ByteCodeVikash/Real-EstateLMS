<?php
/**
 * Run categories schema update migration
 * Run via: php backend/migrations/04_run_migration.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    echo "Connecting to the database...\n";
    $db = Database::getConnection();

    echo "Checking categories table structure...\n";
    
    // Check if categories table exists
    $tableCheck = $db->query("SHOW TABLES LIKE 'categories'");
    if ($tableCheck->rowCount() == 0) {
        throw new Exception("Error: 'categories' table does not exist. Please run update_db.php first.");
    }

    $imageExists = false;
    $sortOrderExists = false;

    $columns = $db->query("SHOW COLUMNS FROM `categories`")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($columns as $column) {
        if ($column === 'image') {
            $imageExists = true;
        }
        if ($column === 'sort_order') {
            $sortOrderExists = true;
        }
    }

    if (!$imageExists || !$sortOrderExists) {
        echo "Applying missing columns to categories table...\n";
        
        if (!$imageExists) {
            echo "Adding column 'image'...\n";
            $db->exec("ALTER TABLE `categories` ADD COLUMN `image` VARCHAR(255) DEFAULT NULL AFTER `description`");
            echo "Column 'image' added successfully.\n";
        } else {
            echo "Column 'image' already exists.\n";
        }

        if (!$sortOrderExists) {
            echo "Adding column 'sort_order'...\n";
            $db->exec("ALTER TABLE `categories` ADD COLUMN `sort_order` INT NOT NULL DEFAULT 0 AFTER `status`");
            echo "Column 'sort_order' added successfully.\n";
        } else {
            echo "Column 'sort_order' already exists.\n";
        }

        echo "Migration 04 applied successfully!\n";
    } else {
        echo "Migration 04 is already applied. Both columns exist.\n";
    }
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
