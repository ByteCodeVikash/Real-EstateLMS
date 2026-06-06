<?php
/**
 * Standalone Migration Runner for Assignment System
 * Run via: php backend/migrations/run_migration.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    echo "Connecting to the database...\n";
    $db = Database::getConnection();

    $sqlFile = __DIR__ . '/01_create_assignments_tables.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("Migration SQL file not found: " . $sqlFile);
    }

    echo "Reading SQL schema from {$sqlFile}...\n";
    $sql = file_get_contents($sqlFile);

    echo "Executing migration queries...\n";
    $db->exec($sql);

    echo "Migration applied successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
