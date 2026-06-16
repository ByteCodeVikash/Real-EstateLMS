<?php
/**
 * Validate Reset Token Endpoint
 */

if (!defined('SECURE_ENTRY')) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'code' => 403, 'message' => 'Direct access forbidden. Requests must route through index.php.']);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/security.php';

// Parse POST inputs
$data = getRequestData();
$token = trim($data['token'] ?? '');

if (empty($token)) {
    sendResponse(400, null, "Validation Error: Token is required.");
}

// Rate limiting
checkRateLimit('validate_reset_token', 30, 60);

try {
    $db = Database::getConnection();
    $now = date('Y-m-d H:i:s');

    // 1. Look up in users table
    $stmtUser = $db->prepare("SELECT id, email, full_name, 'users' AS source_table FROM users WHERE reset_token = ? AND reset_token_expires > ?");
    $stmtUser->execute([$token, $now]);
    $record = $stmtUser->fetch();

    if (!$record) {
        // 2. Look up in admins table
        $stmtAdmin = $db->prepare("SELECT id, email, name AS full_name, 'admins' AS source_table FROM admins WHERE reset_token = ? AND reset_token_expires > ?");
        $stmtAdmin->execute([$token, $now]);
        $record = $stmtAdmin->fetch();
    }

    if ($record) {
        sendResponse(200, [
            'email' => $record['email'],
            'full_name' => $record['full_name'],
            'source' => $record['source_table']
        ], "Token is valid.");
    } else {
        sendResponse(400, null, "The password reset token is invalid or has expired.");
    }

} catch (PDOException $e) {
    sendResponse(500, null, "Database error during token validation: " . (APP_ENV === 'development' ? $e->getMessage() : "Could not complete operation."));
}
