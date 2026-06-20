<?php
/**
 * Automated Certificate Auto-Issue Flow Verification Script
 * Run via: php backend/tests/verify_certificate_flow.php
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
echo YELLOW . "VERIFYING CERTIFICATE AUTO-ISSUE FLOW" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// -----------------------------------------------------------------------------
// PRE-FLIGHT: SETTING UP TEST DATA
// -----------------------------------------------------------------------------
$testUserId = 9500;
$testCatId = 9500;
$testCourseId = 9500;
$testModuleId = 9500;
$testLec1Id = 9501;
$testLec2Id = 9502;

// Clean up any old test data first
$db->exec("DELETE FROM certificates WHERE user_id = $testUserId");
$db->exec("DELETE FROM notifications WHERE user_id = $testUserId");
$db->exec("DELETE FROM lecture_progress WHERE user_id = $testUserId");
$db->exec("DELETE FROM enrollments WHERE user_id = $testUserId");
$db->exec("DELETE FROM lectures WHERE id IN ($testLec1Id, $testLec2Id)");
$db->exec("DELETE FROM course_modules WHERE id = $testModuleId");
$db->exec("DELETE FROM courses WHERE id = $testCourseId");
$db->exec("DELETE FROM categories WHERE id = $testCatId");
$db->exec("DELETE FROM users WHERE id = $testUserId");

// Insert test user, category, course, module, lectures
$db->query("INSERT INTO users (id, full_name, email, password_hash, role, status) VALUES 
    ($testUserId, 'Certificate Test Student', 'certstudent@realtypro.com', 'dummy_pass', 'student', 'Active')");

$db->query("INSERT INTO categories (id, name, slug, status) VALUES 
    ($testCatId, 'Test Category', 'test-cat', 'Active')");

$db->query("INSERT INTO courses (id, category_id, title, slug, mentor_name, price, status) VALUES 
    ($testCourseId, $testCatId, 'Certificate Test Course', 'cert-test-course', 'Test Mentor', 0.00, 'Published')");

$db->query("INSERT INTO course_modules (id, course_id, title, status) VALUES 
    ($testModuleId, $testCourseId, 'Module 1', 'Published')");

$db->query("INSERT INTO lectures (id, module_id, title, sort_order, is_preview, video_type) VALUES 
    ($testLec1Id, $testModuleId, 'Lecture 1.1', 1, 0, 'html5'),
    ($testLec2Id, $testModuleId, 'Lecture 1.2', 2, 0, 'html5')");

// Generate JWT token for user
$studentToken = JWT::encode(['id' => $testUserId, 'full_name' => 'Certificate Test Student', 'email' => 'certstudent@realtypro.com', 'role' => 'student']);

// Start built-in PHP web server on localhost:8095 in background
echo YELLOW . "Starting PHP built-in web server on 127.0.0.1:8095..." . NC . "\n";
$serverProcess = proc_open("exec php -S 127.0.0.1:8095 backend/index.php", [
    0 => ["pipe", "r"],
    1 => ["pipe", "w"],
    2 => ["pipe", "w"]
], $pipes);

if (!is_resource($serverProcess)) {
    echo RED . "Error: Failed to spawn PHP built-in server process." . NC . "\n";
    exit(1);
}

// Wait a moment for server to boot
usleep(250000); // 250ms

// HTTP request helper
function makeRequest(string $method, string $path, ?array $body = null, ?string $token = null): array {
    $url = "http://127.0.0.1:8095" . $path;
    $ch = curl_init($url);
    
    $headers = [
        'Content-Type: application/json'
    ];
    if ($token) {
        $headers[] = "Authorization: Bearer " . $token;
    }
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
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

$allChecksPassed = true;

function verifyCheck($description, $condition) {
    global $allChecksPassed;
    if ($condition) {
        echo GREEN . "  [PASS] " . NC . $description . "\n";
    } else {
        echo RED . "  [FAIL] " . NC . $description . "\n";
        $allChecksPassed = false;
    }
}

try {
    // -------------------------------------------------------------------------
    // Step 1: Enroll in Course
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- Step 1: Enrolling in course ---" . NC . "\n";
    $res = makeRequest('POST', '/api/enrollments', ['course_id' => $testCourseId], $studentToken);
    $enrollmentId = $res['body']['data']['id'] ?? null;
    verifyCheck("Enrolled successfully in course (Enrollment ID: " . ($enrollmentId ?? 'None') . ")", $res['code'] === 201 && $enrollmentId !== null);

    // Verify progress is 0% and certificate_issued is 0
    $enrollQuery = $db->query("SELECT progress, certificate_issued FROM enrollments WHERE id = $enrollmentId")->fetch();
    verifyCheck("Initial progress is 0%", (int)$enrollQuery['progress'] === 0);
    verifyCheck("Initial certificate_issued is 0", (int)$enrollQuery['certificate_issued'] === 0);

    // -------------------------------------------------------------------------
    // Step 2: Complete first lecture (50% progress)
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- Step 2: Completing first lecture (50% progress) ---" . NC . "\n";
    $res = makeRequest('POST', "/api/lectures/{$testLec1Id}/progress", [
        'playhead_seconds' => 10,
        'duration_seconds' => 10,
        'is_completed' => 1
    ], $studentToken);
    
    verifyCheck("Lecture 1 progress updated successfully", $res['code'] === 200);
    verifyCheck("Course progress is 50% in API response", ($res['body']['data']['course_progress'] ?? 0) === 50);

    // Verify DB state
    $enrollQuery = $db->query("SELECT progress, certificate_issued FROM enrollments WHERE id = $enrollmentId")->fetch();
    verifyCheck("Progress in DB is 50%", (int)$enrollQuery['progress'] === 50);
    verifyCheck("certificate_issued in DB is still 0", (int)$enrollQuery['certificate_issued'] === 0);

    // Check certificates table
    $certCount = $db->query("SELECT COUNT(*) FROM certificates WHERE user_id = $testUserId AND course_id = $testCourseId")->fetchColumn();
    verifyCheck("No certificate generated yet in DB", (int)$certCount === 0);

    // -------------------------------------------------------------------------
    // Step 3: Complete second lecture (100% progress) & auto generate certificate
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- Step 3: Completing second lecture (100% progress) ---" . NC . "\n";
    $res = makeRequest('POST', "/api/lectures/{$testLec2Id}/progress", [
        'playhead_seconds' => 10,
        'duration_seconds' => 10,
        'is_completed' => 1
    ], $studentToken);

    verifyCheck("Lecture 2 progress updated successfully", $res['code'] === 200);
    verifyCheck("Course progress is 100% in API response", ($res['body']['data']['course_progress'] ?? 0) === 100);
    verifyCheck("certificate_issued flag is true in API response", ($res['body']['data']['certificate_issued'] ?? false) === true);

    // -------------------------------------------------------------------------
    // Step 4: Verify certificate_issued flag updates to 1 in DB
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- Step 4: Verifying certificate_issued flag in DB ---" . NC . "\n";
    $enrollQuery = $db->query("SELECT progress, certificate_issued FROM enrollments WHERE id = $enrollmentId")->fetch();
    verifyCheck("Enrollment progress in DB is 100%", (int)$enrollQuery['progress'] === 100);
    verifyCheck("Enrollment certificate_issued flag in DB is 1", (int)$enrollQuery['certificate_issued'] === 1);

    // -------------------------------------------------------------------------
    // Step 5: Verify Certificate stored in DB
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- Step 5: Verifying certificate record in DB ---" . NC . "\n";
    $certificate = $db->query("SELECT * FROM certificates WHERE user_id = $testUserId AND course_id = $testCourseId")->fetch();
    verifyCheck("Certificate record exists in DB", !empty($certificate));
    verifyCheck("Certificate number is non-empty (" . ($certificate['certificate_number'] ?? 'None') . ")", !empty($certificate['certificate_number']));

    // -------------------------------------------------------------------------
    // Step 6: Verify Download (Retrieving list/details) works
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- Step 6: Verifying certificate download/retrieval works ---" . NC . "\n";
    $res = makeRequest('GET', '/api/certificates', null, $studentToken);
    verifyCheck("Certificate API returns 200 OK", $res['code'] === 200);
    
    $certsList = $res['body']['data'] ?? [];
    $foundCert = null;
    foreach ($certsList as $c) {
        if ($c['course_id'] === $testCourseId && $c['user_id'] === $testUserId) {
            $foundCert = $c;
            break;
        }
    }
    verifyCheck("Certificate found in retrieve list with correct course title", $foundCert !== null && $foundCert['course_title'] === 'Certificate Test Course');

    // -------------------------------------------------------------------------
    // Step 7: Verify Duplicate certificates cannot be generated
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- Step 7: Verifying duplicate prevention ---" . NC . "\n";
    
    // Attempt 1: Re-submit progress update
    echo "  Attempting to trigger issue again via progress update API...\n";
    $res = makeRequest('POST', "/api/lectures/{$testLec2Id}/progress", [
        'playhead_seconds' => 10,
        'duration_seconds' => 10,
        'is_completed' => 1
    ], $studentToken);
    verifyCheck("API response indicates certificate was not issued again", ($res['body']['data']['certificate_issued'] ?? false) === false);

    // Attempt 2: Direct POST request to generate endpoint
    echo "  Attempting to trigger manual generation endpoint...\n";
    $res = makeRequest('POST', '/api/certificates/generate', ['course_id' => $testCourseId], $studentToken);
    verifyCheck("Manual generate endpoint returns status 200", $res['code'] === 200);
    verifyCheck("Manual generate indicates 'Certificate already generated.'", $res['body']['message'] === 'Certificate already generated.');

    // Count in DB
    $certCount = $db->query("SELECT COUNT(*) FROM certificates WHERE user_id = $testUserId AND course_id = $testCourseId")->fetchColumn();
    verifyCheck("Exactly 1 certificate exists in certificates table", (int)$certCount === 1);

} catch (Exception $ex) {
    echo RED . "Test execution error: " . $ex->getMessage() . NC . "\n";
    $allChecksPassed = false;
} finally {
    // -------------------------------------------------------------------------
    // TEARDOWN & CLEANUP
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "Cleaning up test assets from database..." . NC . "\n";
    $db->exec("DELETE FROM certificates WHERE user_id = $testUserId");
    $db->exec("DELETE FROM notifications WHERE user_id = $testUserId");
    $db->exec("DELETE FROM lecture_progress WHERE user_id = $testUserId");
    $db->exec("DELETE FROM enrollments WHERE user_id = $testUserId");
    $db->exec("DELETE FROM lectures WHERE id IN ($testLec1Id, $testLec2Id)");
    $db->exec("DELETE FROM course_modules WHERE id = $testModuleId");
    $db->exec("DELETE FROM courses WHERE id = $testCourseId");
    $db->exec("DELETE FROM categories WHERE id = $testCatId");
    $db->exec("DELETE FROM users WHERE id = $testUserId");

    // Shut down PHP built-in web server
    echo YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
if ($allChecksPassed) {
    echo GREEN . "RESULT: PASS" . NC . "\n";
    exit(0);
} else {
    echo RED . "RESULT: FAIL" . NC . "\n";
    exit(1);
}
