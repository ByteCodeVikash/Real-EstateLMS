<?php
/**
 * Run status enum update migration
 * Run via: php backend/migrations/02_run_migration.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    echo "Connecting to the database...\n";
    $db = Database::getConnection();

    $sqlFile = __DIR__ . '/02_update_submissions_status_enum.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("Migration SQL file not found: " . $sqlFile);
    }

    echo "Reading SQL migration from {$sqlFile}...\n";
    $sql = file_get_contents($sqlFile);

    echo "Executing alteration query...\n";
    $db->exec($sql);

    echo "Migration 02 applied successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
