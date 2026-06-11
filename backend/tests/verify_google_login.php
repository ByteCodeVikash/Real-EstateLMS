<?php
/**
 * REST API Verification Script for Google Authentication Endpoints
 * Run via: php backend/tests/verify_google_login.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/jwt.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "GOOGLE AUTHENTICATION API INTEGRATION AUDIT" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// 1. Start built-in PHP web server on localhost:8093 in background
echo YELLOW . "Starting PHP built-in web server on 127.0.0.1:8093..." . NC . "\n";
$serverProcess = proc_open("exec php -S 127.0.0.1:8093 backend/index.php", [
    0 => ["pipe", "r"],
    1 => ["pipe", "w"],
    2 => ["pipe", "w"]
], $pipes);

if (!is_resource($serverProcess)) {
    echo RED . "Error: Failed to spawn PHP built-in server process." . NC . "\n";
    exit(1);
}

// Give the server a moment to boot
usleep(250000); // 250ms

// Define HTTP request helper
function makeGoogleAuthRequest(?array $body = null): array {
    $url = "http://127.0.0.1:8093/api/auth/google";
    $ch = curl_init($url);
    
    $headers = [
        'Content-Type: application/json'
    ];
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $data = json_decode($response, true);
    return [
        'code' => $httpCode,
        'body' => $data,
        'raw' => $response
    ];
}

$testsRun = 0;
$testsPassed = 0;

function assertAPI(string $name, bool $expression, string $failureDetails = '') {
    global $testsRun, $testsPassed;
    $testsRun++;
    if ($expression) {
        $testsPassed++;
        echo GREEN . "  [PASS] " . NC . $name . "\n";
    } else {
        echo RED . "  [FAIL] " . NC . $name . "\n";
        if ($failureDetails) {
            echo "         Details: " . $failureDetails . "\n";
        }
    }
}

try {
    // 0. Cleanup any existing test users
    $db->exec("DELETE FROM users WHERE email IN ('jane@example.com', 'newuser@example.com')");

    // =========================================================================
    // 1. Validation Checks
    // =========================================================================
    
    // A. Empty request body
    $res = makeGoogleAuthRequest([]);
    assertAPI("POST /api/auth/google with empty payload returns 400", 
        $res['code'] === 400, 
        "Code: " . $res['code'] . " Response: " . json_encode($res['body'])
    );

    // B. Invalid/Tampered token validation check
    $res = makeGoogleAuthRequest(['id_token' => 'invalid-token-value']);
    assertAPI("POST /api/auth/google with invalid token returns 401", 
        $res['code'] === 401, 
        "Code: " . $res['code']
    );

    // =========================================================================
    // 2. User Creation & Registration Flow (Onboarding)
    // =========================================================================
    
    // A. Autoregistration for non-existent user
    $res = makeGoogleAuthRequest(['id_token' => 'mock-google-token-new']);
    $regOk = ($res['code'] === 200 && isset($res['body']['data']['token']));
    assertAPI("POST /api/auth/google with new mock token registers and logs in user", 
        $regOk, 
        "Code: " . $res['code'] . " Body: " . json_encode($res['body'])
    );

    if ($regOk) {
        $data = $res['body']['data'];
        $jwtToken = $data['token'];
        $userObj = $data['user'];

        // Verify database entry
        $stmt = $db->prepare("SELECT * FROM users WHERE email = 'newuser@example.com'");
        $stmt->execute();
        $dbUser = $stmt->fetch();

        assertAPI("User exists in database", $dbUser !== false);
        assertAPI("User role defaults to 'student'", $dbUser['role'] === 'student');
        assertAPI("User status defaults to 'Active'", $dbUser['status'] === 'Active');
        assertAPI("User google_id is saved correctly", $dbUser['google_id'] === 'google-new-987654');
        assertAPI("User avatar_url is populated from Google photo", $dbUser['avatar_url'] === 'https://lh3.googleusercontent.com/a/mock-avatar-new');
        assertAPI("User auth_provider is set to 'google'", $dbUser['auth_provider'] === 'google');

        // Verify JWT token signature and payload claims
        $claims = JWT::decode($jwtToken);
        assertAPI("JWT token has valid signature and decodes successfully", $claims !== null);
        if ($claims) {
            assertAPI("JWT payload contains correct 'id' claim", $claims['id'] === (int)$dbUser['id']);
            assertAPI("JWT payload contains correct 'email' claim", $claims['email'] === 'newuser@example.com');
            assertAPI("JWT payload contains correct 'role' claim", $claims['role'] === 'student');
            assertAPI("JWT payload contains valid expiration claim", $claims['exp'] > time());
        }
    }

    // =========================================================================
    // 3. Existing User Account Linking & Login Flow
    // =========================================================================

    // A. Create an existing local user with matching email but no google_id
    $db->exec("INSERT INTO users (full_name, email, password_hash, role, status, auth_provider) 
               VALUES ('Jane Doe', 'jane@example.com', 'some_local_hash', 'student', 'Active', 'local')");

    // Login with Google (Jane)
    $res = makeGoogleAuthRequest(['id_token' => 'mock-google-token-jane']);
    $linkOk = ($res['code'] === 200 && isset($res['body']['data']['token']));
    assertAPI("POST /api/auth/google links account on email match", 
        $linkOk, 
        "Code: " . $res['code'] . " Body: " . json_encode($res['body'])
    );

    if ($linkOk) {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = 'jane@example.com'");
        $stmt->execute();
        $dbUser = $stmt->fetch();

        assertAPI("User google_id is updated/linked", $dbUser['google_id'] === 'google-jane-123456');
        assertAPI("User auth_provider updated to 'google'", $dbUser['auth_provider'] === 'google');
        assertAPI("User avatar_url updated", $dbUser['avatar_url'] === 'https://lh3.googleusercontent.com/a/mock-avatar-jane');
    }

    // B. Submitting Jane's mock token again (already linked)
    $res = makeGoogleAuthRequest(['id_token' => 'mock-google-token-jane']);
    assertAPI("Subsequent Google Login for already linked user succeeds", 
        $res['code'] === 200 && isset($res['body']['data']['token'])
    );

    // =========================================================================
    // 4. Inactive/Suspended Accounts Rejection Flow
    // =========================================================================
    
    // Suspend Jane's account in DB
    $db->exec("UPDATE users SET status = 'Suspended' WHERE email = 'jane@example.com'");

    $res = makeGoogleAuthRequest(['id_token' => 'mock-google-token-jane']);
    assertAPI("Google sign-in is rejected (403 Forbidden) for Suspended user status", 
        $res['code'] === 403, 
        "Code: " . $res['code'] . " Body: " . json_encode($res['body'])
    );

} finally {
    // Teardown database entries
    $db->exec("DELETE FROM users WHERE email IN ('jane@example.com', 'newuser@example.com')");

    // Shut down PHP built-in web server
    echo "\n" . YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "GOOGLE AUTHENTICATION API AUDIT COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    echo GREEN . "All Google Login verification checks completed successfully!" . NC . "\n";
    exit(0);
} else {
    echo RED . "Some Google Login integration checks failed." . NC . "\n";
    exit(1);
}
