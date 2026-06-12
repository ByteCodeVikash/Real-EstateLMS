<?php
/**
 * User Login Endpoint for BG Realty Training Academy LMS
 */

if (!defined('SECURE_ENTRY')) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'code' => 403, 'message' => 'Direct access forbidden. Requests must route through index.php.']);
    exit;
}


require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/jwt.php';
require_once __DIR__ . '/../../helpers/security.php';

// Parse POST input data payload
$data = getRequestData();

$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$remember = (bool)($data['remember'] ?? false);

if (empty($email) || empty($password)) {
    sendResponse(400, null, "Validation Error: Email and password fields are required.");
}

if (strlen($email) > 254) {
    sendResponse(400, null, "Validation Error: Email address exceeds maximum length.");
}

if (strlen($password) > 72) {
    sendResponse(400, null, "Validation Error: Password is too long (maximum 72 characters).");
}

// Security validations
checkRateLimit('login', 20, 60);
checkBruteForce($email);

try {
    $db = Database::getConnection();
    
    // 1. Check user/student table
    $stmt = $db->prepare("SELECT id, full_name, email, password_hash, role, status FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    $isAuthenticated = false;
    $role            = 'student';
    $userData        = null;
    
    if ($user) {
        if (password_verify($password, $user['password_hash'])) {
            if ($user['status'] !== 'Active') {
                sendResponse(403, null, "Forbidden: Your account is currently " . strtolower($user['status']) . ".");
            }
            $isAuthenticated = true;
            $role            = $user['role'] ?? 'student';
            $userData        = $user;
        }
    } else {
        // 2. Fallback check for admin database table
        $stmtAdmin = $db->prepare("SELECT id, name AS full_name, email, password_hash, role FROM admins WHERE email = ?");
        $stmtAdmin->execute([$email]);
        $admin = $stmtAdmin->fetch();
        
        if ($admin && password_verify($password, $admin['password_hash'])) {
            $isAuthenticated = true;
            // Map legacy Super Admin to 'super_admin', others to 'admin'
            $role            = ($admin['role'] === 'Super Admin') ? 'super_admin' : 'admin';
            $userData        = $admin;
        }
    }
    
    if (!$isAuthenticated) {
        recordFailedLogin($email);
        sendResponse(401, null, "Unauthorized: Invalid email or password.");
    }

    // Clear failed login attempts on successful login
    clearFailedLogins($email);
    
    // Calculate expiration window: 30 days if remember me is set, else 24 hours
    $expiration = time() + ($remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60);
    
    $tokenPayload = [
        'id'        => (int)$userData['id'],
        'full_name' => $userData['full_name'],
        'email'     => $userData['email'],
        'role'      => $role,
        'exp'       => $expiration
    ];
    
    $token = JWT::encode($tokenPayload);
    
    sendResponse(200, [
        'token' => $token,
        'user'  => [
            'id'        => (int)$userData['id'],
            'full_name' => $userData['full_name'],
            'email'     => $userData['email'],
            'role'      => $role
        ]
    ], "Login completed successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database error during login: " . (APP_ENV === 'development' ? $e->getMessage() : "Could not complete operation."));
}
