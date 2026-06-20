<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

define('SECURE_ENTRY', true);
require_once __DIR__ . '/config/config.php';

$dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $db = null;
    try {
        $db = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        $fallbackPass = defined('DB_PASS_FALLBACK') ? DB_PASS_FALLBACK : '';
        if ($fallbackPass !== '' && $fallbackPass !== DB_PASS) {
            $db = new PDO($dsn, DB_USER, $fallbackPass, $options);
        } else {
            throw $e;
        }
    }

    echo "CONNECTED_TO_MYSQL\n";
    $stmt = $db->query("SHOW DATABASES");
    $dbs = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "DATABASES:" . implode(',', $dbs) . "\n";

} catch (Exception $e) {
    echo "ERROR:" . $e->getMessage() . "\n";
}
