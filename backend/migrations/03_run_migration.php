<?php
/**
 * Run content publishing system tables migration
 * Run via: php backend/migrations/03_run_migration.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    echo "Connecting to the database...\n";
    $db = Database::getConnection();

    $sqlFile = __DIR__ . '/03_publish_system_tables.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("Migration SQL file not found: " . $sqlFile);
    }

    echo "Reading SQL migration from {$sqlFile}...\n";
    $sql = file_get_contents($sqlFile);

    echo "Executing table creation query...\n";
    $db->exec($sql);
    echo "Tables created successfully.\n";

    echo "Checking for recording_url column in webinars...\n";
    $colCheck = $db->query("SHOW COLUMNS FROM `webinars` LIKE 'recording_url'");
    if ($colCheck->rowCount() == 0) {
        echo "Adding recording_url column to webinars...\n";
        $db->exec("ALTER TABLE `webinars` ADD COLUMN `recording_url` VARCHAR(255) DEFAULT NULL");
        echo "Column added successfully.\n";
    } else {
        echo "Column recording_url already exists.\n";
    }

    echo "Migration 03 applied successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
