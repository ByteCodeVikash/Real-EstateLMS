<?php
define('SECURE_ENTRY', true);
require_once __DIR__ . '/config/db.php';
try {
    $db = Database::getConnection();
    echo "--- Users matching test emails ---\n";
    $stmt = $db->query("SELECT id, email, role FROM users WHERE email LIKE '%realtypro.com%' OR email LIKE '%bgrealtyacademy.com%'");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
    
    echo "--- Describe assignment_submissions ---\n";
    $stmt = $db->query("DESCRIBE assignment_submissions");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
