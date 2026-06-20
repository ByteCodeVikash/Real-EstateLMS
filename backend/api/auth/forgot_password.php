<?php
/**
 * Forgot Password Endpoint
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
$email = trim($data['email'] ?? '');

if (empty($email)) {
    sendResponse(400, null, "Validation Error: Email address is required.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(400, null, "Validation Error: Please enter a valid email address.");
}

// Check rate limits to prevent abuse
checkRateLimit('forgot_password', 10, 60);

try {
    $db = Database::getConnection();

    // 1. Look up in users table
    $stmtUser = $db->prepare("SELECT id, full_name, email FROM users WHERE email = ?");
    $stmtUser->execute([$email]);
    $user = $stmtUser->fetch();

    $found = false;
    $targetTable = null;
    $userId = null;

    if ($user) {
        $found = true;
        $targetTable = 'users';
        $userId = $user['id'];
    } else {
        // 2. Look up in admins table
        $stmtAdmin = $db->prepare("SELECT id, name AS full_name, email FROM admins WHERE email = ?");
        $stmtAdmin->execute([$email]);
        $admin = $stmtAdmin->fetch();
        if ($admin) {
            $found = true;
            $targetTable = 'admins';
            $userId = $admin['id'];
        }
    }

    $debugLink = null;

    if ($found) {
        // Generate secure random token
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry

        // Update database
        $updateQuery = "UPDATE `{$targetTable}` SET reset_token = ?, reset_token_expires = ? WHERE id = ?";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->execute([$token, $expires, $userId]);

        // Construct reset link
        $resetLink = rtrim(FRONTEND_URL, '/') . '/reset-password?token=' . $token;

        // Log the simulated email reset
        $logDir = __DIR__ . '/../../logs';
        if (!is_dir($logDir)) {
            @mkdir($logDir, 0755, true);
        }
        $logMsg = "[" . date('Y-m-d H:i:s') . "] TO: {$email} | TABLE: {$targetTable} | LINK: {$resetLink}\n";
        @file_put_contents($logDir . '/mail.log', $logMsg, FILE_APPEND);

        if (APP_ENV === 'development') {
            $debugLink = $resetLink;
        }
    }

    // Always respond with success to prevent email enumeration attacks
    $responseData = [];
    if ($debugLink) {
        $responseData['debug_link'] = $debugLink;
    }

    sendResponse(200, $responseData, "If the email is registered in our system, a password reset link has been generated.");

} catch (PDOException $e) {
    sendResponse(500, null, "Database error during password reset request: " . (APP_ENV === 'development' ? $e->getMessage() : "Could not complete operation."));
}
