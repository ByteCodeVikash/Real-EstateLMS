<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

define('SECURE_ENTRY', true);
require_once __DIR__ . '/config/config.php';

$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=utf8mb4";
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

    echo "<h1>Raw Database Dump</h1>";
    echo "<p>Connected to: <strong>" . DB_NAME . "</strong></p>";

    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "<h2>Tables:</h2><pre>";
    print_r($tables);
    echo "</pre>";

    if (in_array('users', $tables)) {
        echo "<h2>Columns in 'users':</h2><pre>";
        $desc = $db->query("DESCRIBE `users`")->fetchAll();
        print_r($desc);
        echo "</pre>";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
