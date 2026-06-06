<?php
/**
 * User Sign-up Endpoint for BG Realty Training Academy LMS
 */

if (!defined('SECURE_ENTRY')) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'code' => 403, 'message' => 'Direct access forbidden. Requests must route through index.php.']);
    exit;
}


require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';

// Parse POST input data payload
$data = getRequestData();

$fullName        = trim(strip_tags($data['full_name'] ?? ''));
$email           = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));
$phone           = trim(strip_tags($data['phone'] ?? ''));
$password        = $data['password'] ?? '';
$confirmPassword = $data['confirm_password'] ?? '';

// Validate Fields
if (empty($fullName) || empty($email) || empty($password)) {
    sendResponse(400, null, "Validation Error: Full name, email, and password fields are required.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(400, null, "Validation Error: Please enter a valid email address.");
}

if (strlen($password) < 6) {
    sendResponse(400, null, "Validation Error: Password must be at least 6 characters long.");
}

if ($password !== $confirmPassword) {
    sendResponse(400, null, "Validation Error: Password verification failed. Passwords do not match.");
}

try {
    $db = Database::getConnection();
    
    // Check if email already exists in users table
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(409, null, "Conflict: An account with this email address already exists.");
    }
    
    // Check if email exists in admins table to prevent collisions
    $stmtAdmin = $db->prepare("SELECT id FROM admins WHERE email = ?");
    $stmtAdmin->execute([$email]);
    if ($stmtAdmin->fetch()) {
        sendResponse(409, null, "Conflict: An administrative account with this email address already exists.");
    }

    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    
    // Insert new user into database
    $insertStmt = $db->prepare("INSERT INTO users (full_name, email, phone, password_hash, role, status) VALUES (?, ?, ?, ?, 'student', 'Active')");
    $insertStmt->execute([$fullName, $email, $phone, $passwordHash]);
    
    $userId = $db->lastInsertId();
    
    sendResponse(201, ['user_id' => $userId], "User registration completed successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database error during registration: " . (APP_ENV === 'development' ? $e->getMessage() : "Could not complete operation."));
}
