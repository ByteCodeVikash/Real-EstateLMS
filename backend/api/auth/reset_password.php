<?php
/**
 * Reset Password Endpoint
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
$password = $data['password'] ?? '';
$confirmPassword = $data['confirm_password'] ?? '';

if (empty($token)) {
    sendResponse(400, null, "Validation Error: Reset token is required.");
}

if (empty($password) || empty($confirmPassword)) {
    sendResponse(400, null, "Validation Error: Password and confirm password fields are required.");
}

if (strlen($password) < 6) {
    sendResponse(400, null, "Validation Error: Password must be at least 6 characters.");
}

if (strlen($password) > 72) {
    sendResponse(400, null, "Validation Error: Password is too long (maximum 72 characters).");
}

if ($password !== $confirmPassword) {
    sendResponse(400, null, "Validation Error: Passwords do not match.");
}

// Rate limiting
checkRateLimit('reset_password', 10, 60);

try {
    $db = Database::getConnection();
    $now = date('Y-m-d H:i:s');

    // 1. Look up in users table
    $stmtUser = $db->prepare("SELECT id, 'users' AS source_table FROM users WHERE reset_token = ? AND reset_token_expires > ?");
    $stmtUser->execute([$token, $now]);
    $record = $stmtUser->fetch();

    if (!$record) {
        // 2. Look up in admins table
        $stmtAdmin = $db->prepare("SELECT id, 'admins' AS source_table FROM admins WHERE reset_token = ? AND reset_token_expires > ?");
        $stmtAdmin->execute([$token, $now]);
        $record = $stmtAdmin->fetch();
    }

    if ($record) {
        $userId = $record['id'];
        $table = $record['source_table'];

        // Hash the new password
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        // Update record and clear token
        $updateStmt = $db->prepare("UPDATE `{$table}` SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?");
        $updateStmt->execute([$passwordHash, $userId]);

        // Clear brute force failures for this user's email if possible
        // To do this, we can fetch the user's email first
        $emailStmt = $db->prepare("SELECT email FROM `{$table}` WHERE id = ?");
        $emailStmt->execute([$userId]);
        $emailVal = $emailStmt->fetchColumn();
        if ($emailVal) {
            clearFailedLogins($emailVal);
        }

        sendResponse(200, null, "Password has been successfully updated.");
    } else {
        sendResponse(400, null, "The password reset token is invalid or has expired.");
    }

} catch (PDOException $e) {
    sendResponse(500, null, "Database error during password update: " . (APP_ENV === 'development' ? $e->getMessage() : "Could not complete operation."));
}
