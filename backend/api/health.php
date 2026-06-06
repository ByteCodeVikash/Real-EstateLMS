<?php
/**
 * Health and Diagnostics Endpoint for BG Realty Training Academy LMS REST API
 */

if (!defined('SECURE_ENTRY')) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'code' => 403, 'message' => 'Direct access forbidden. Requests must route through index.php.']);
    exit;
}


require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$health = [
    'environment' => APP_ENV,
    'php_version' => PHP_VERSION,
    'database'    => 'disconnected'
];

try {
    $db = Database::getConnection();
    // Run cheap query to check active database visibility
    $stmt = $db->query("SELECT 1");
    if ($stmt) {
        $health['database'] = 'connected';
    }
} catch (PDOException $e) {
    $health['database'] = 'offline';
    $health['database_error'] = (APP_ENV === 'development') ? $e->getMessage() : 'Database connection error';
}

$status = ($health['database'] === 'connected') ? 200 : 503;
sendResponse($status, $health, "System diagnostics completed.");
