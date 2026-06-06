<?php
/**
 * Google Auth / Login Endpoint for BG Realty Training Academy LMS
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

// Parse POST input data payload
$data = getRequestData();

$idToken  = trim($data['id_token'] ?? $data['credential'] ?? '');
$remember = (bool)($data['remember'] ?? false);

if (empty($idToken)) {
    sendResponse(400, null, "Validation Error: Google ID token is required.");
}

/**
 * Validates Google ID token via HTTP request to Google API or mock validator in dev environment.
 */
function verifyGoogleIdToken($token) {
    if (APP_ENV === 'development' && strpos($token, 'mock-google-token') === 0) {
        if ($token === 'mock-google-token-jane') {
            return [
                'sub' => 'google-jane-123456',
                'email' => 'jane@example.com',
                'name' => 'Jane Doe',
                'picture' => 'https://lh3.googleusercontent.com/a/mock-avatar-jane',
                'aud' => GOOGLE_CLIENT_ID
            ];
        }
        if ($token === 'mock-google-token-new') {
            return [
                'sub' => 'google-new-987654',
                'email' => 'newuser@example.com',
                'name' => 'New User',
                'picture' => 'https://lh3.googleusercontent.com/a/mock-avatar-new',
                'aud' => GOOGLE_CLIENT_ID
            ];
        }
        return false;
    }

    $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($token);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200 && $response) {
        $payload = json_decode($response, true);
        if (isset($payload['sub']) && isset($payload['email'])) {
            return $payload;
        }
    }
    return false;
}

// 1. Verify token with Google
$googlePayload = verifyGoogleIdToken($idToken);

if (!$googlePayload) {
    sendResponse(401, null, "Unauthorized: Invalid Google ID token.");
}

// 2. Security validation: check audience claim
$aud = $googlePayload['aud'] ?? '';
if (APP_ENV !== 'development' && $aud !== GOOGLE_CLIENT_ID) {
    sendResponse(401, null, "Unauthorized: Client ID mismatch.");
}

$googleId = $googlePayload['sub'];
$email    = strtolower(trim($googlePayload['email']));
$name     = trim($googlePayload['name'] ?? '');
$picture  = trim($googlePayload['picture'] ?? '');

try {
    $db = Database::getConnection();
    
    // 3. Search for user by google_id
    $stmt = $db->prepare("SELECT id, full_name, email, role, status FROM users WHERE google_id = ?");
    $stmt->execute([$googleId]);
    $user = $stmt->fetch();
    
    $userId = null;
    $role = 'student';
    $fullName = $name;
    $userEmail = $email;
    $status = 'Active';
    
    if ($user) {
        // User exists and is linked via Google
        $userId = $user['id'];
        $role = $user['role'];
        $fullName = $user['full_name'];
        $userEmail = $user['email'];
        $status = $user['status'];
        
        if ($status !== 'Active') {
            sendResponse(403, null, "Forbidden: Your account is currently " . strtolower($status) . ".");
        }
    } else {
        // 4. Try lookup by email (Account Linking)
        $stmtEmail = $db->prepare("SELECT id, full_name, role, status, google_id FROM users WHERE email = ?");
        $stmtEmail->execute([$email]);
        $userByEmail = $stmtEmail->fetch();
        
        if ($userByEmail) {
            $userId = $userByEmail['id'];
            $role = $userByEmail['role'];
            $fullName = $userByEmail['full_name'];
            $userEmail = $email;
            $status = $userByEmail['status'];
            
            if ($status !== 'Active') {
                sendResponse(403, null, "Forbidden: Your account is currently " . strtolower($status) . ".");
            }
            
            // Link existing account
            $updateStmt = $db->prepare("UPDATE users SET google_id = ?, avatar_url = ?, auth_provider = 'google' WHERE id = ?");
            $updateStmt->execute([$googleId, $picture, $userId]);
        } else {
            // 5. User does not exist - Auto-registration (Onboarding)
            $insertStmt = $db->prepare("INSERT INTO users (full_name, email, google_id, avatar_url, auth_provider, role, status) VALUES (?, ?, ?, ?, 'google', 'student', 'Active')");
            $insertStmt->execute([$fullName, $userEmail, $googleId, $picture]);
            $userId = $db->lastInsertId();
        }
    }
    
    // 6. Generate session JWT token
    $expiration = time() + ($remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60);
    
    $tokenPayload = [
        'id'        => (int)$userId,
        'full_name' => $fullName,
        'email'     => $userEmail,
        'role'      => $role,
        'exp'       => $expiration
    ];
    
    $token = JWT::encode($tokenPayload);
    
    sendResponse(200, [
        'token' => $token,
        'user'  => [
            'id'        => (int)$userId,
            'full_name' => $fullName,
            'email'     => $userEmail,
            'role'      => $role
        ]
    ], "Google sign-in completed successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database error during Google sign-in: " . (APP_ENV === 'development' ? $e->getMessage() : "Could not complete operation."));
}
