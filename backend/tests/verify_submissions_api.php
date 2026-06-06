<?php
/**
 * REST API Verification Script for Assignment Submission Endpoints
 * Run via: php backend/tests/verify_submissions_api.php
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
echo YELLOW . "ASSIGNMENT SUBMISSION API INTEGRATION TESTING" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// 1. Setup seed states
$courseId = (int)$db->query("SELECT id FROM courses LIMIT 1")->fetchColumn();
if (!$courseId) {
    echo RED . "Error: No courses found in database to perform API testing." . NC . "\n";
    exit(1);
}

// Ensure mock users exist
$db->query("INSERT IGNORE INTO users (id, full_name, email, password_hash, role, status) VALUES 
    (1, 'Sarah Jenkins', 'sarah.j@realtypro.com', 'dummy_pass', 'student', 'Active'),
    (2, 'John Miller', 'john.m@realtypro.com', 'dummy_pass', 'student', 'Active')");

// Ensure user ID 1 and 2 are enrolled in the course as active students
$db->prepare("INSERT IGNORE INTO enrollments (user_id, course_id, progress, completion_status) VALUES (1, ?, 0, 'Active')")->execute([$courseId]);
$db->prepare("INSERT IGNORE INTO enrollments (user_id, course_id, progress, completion_status) VALUES (2, ?, 0, 'Active')")->execute([$courseId]);

// Generate actual JWT for user ID 2 to test isolation
$student2Token = JWT::encode([
    'id' => 2,
    'full_name' => 'John Miller',
    'email' => 'john.m@realtypro.com',
    'role' => 'student'
]);

// 2. Start built-in PHP web server on localhost:8089 in background
echo YELLOW . "Starting PHP built-in web server on 127.0.0.1:8089..." . NC . "\n";
$serverProcess = proc_open("exec php -S 127.0.0.1:8089 backend/index.php", [
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

// Define HTTP request helpers
function makeRequest(string $method, string $path, ?array $body = null, ?string $token = null): array {
    $url = "http://127.0.0.1:8089" . $path;
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
    
    return [
        'code' => $httpCode,
        'body' => json_decode($response, true),
        'raw' => $response
    ];
}

function makeMultipartRequest(string $path, string $filePath, string $mimeType, string $postName, ?string $token = null): array {
    $url = "http://127.0.0.1:8089" . $path;
    $ch = curl_init($url);
    
    $headers = [];
    if ($token) {
        $headers[] = "Authorization: Bearer " . $token;
    }
    
    $cfile = new CURLFile($filePath, $mimeType, $postName);
    $data = [
        'file' => $cfile
    ];
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'body' => json_decode($response, true),
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

// Prepare temporary local dummy files to upload
$tmpPdf = __DIR__ . '/dummy_assignment.pdf';
$tmpExe = __DIR__ . '/dummy_exploit.exe';
$tmpDoubleExt = __DIR__ . '/exploit.php.pdf';

file_put_contents($tmpPdf, "Dummy PDF assignment content.");
file_put_contents($tmpExe, "Dummy executable contents.");
file_put_contents($tmpDoubleExt, "Dummy double-extension malicious text.");

$activeAssignId = null;
$expiredAssignId = null;
$createdSubmissionId = null;
$firstFileDiskPath = null;

try {
    // A. Setup test assignments
    // Active Assignment (Due in 1 year)
    $stmt1 = $db->prepare("INSERT INTO assignments (course_id, title, max_marks, due_date, status, created_by) VALUES (?, 'Active Test Assignment', 100, ?, 'Published', 1)");
    $stmt1->execute([$courseId, date('Y-m-d H:i:s', time() + 31536000)]);
    $activeAssignId = (int)$db->lastInsertId();
    
    // Expired Assignment (Due yesterday)
    $stmt2 = $db->prepare("INSERT INTO assignments (course_id, title, max_marks, due_date, status, created_by) VALUES (?, 'Expired Test Assignment', 100, ?, 'Published', 1)");
    $stmt2->execute([$courseId, date('Y-m-d H:i:s', time() - 86400)]);
    $expiredAssignId = (int)$db->lastInsertId();

    echo "Prepared Active Assignment ID: {$activeAssignId}\n";
    echo "Prepared Expired Assignment ID: {$expiredAssignId}\n\n";

    // -------------------------------------------------------------------------
    // Integration Tests
    // -------------------------------------------------------------------------

    // Test 1: POST submission unauthenticated
    $res = makeRequest('POST', "/api/assignments/{$activeAssignId}/submit");
    assertAPI("Submit unauthenticated is blocked with 401", $res['code'] === 401, "Code: " . $res['code']);

    // Test 2: POST valid PDF file upload for student 1
    $res = makeMultipartRequest("/api/assignments/{$activeAssignId}/submit", $tmpPdf, 'application/pdf', 'dummy_assignment.pdf', 'mock-student-token');
    $success = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST valid PDF submission succeeds with 201", $success, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    
    if ($success) {
        $createdSubmissionId = (int)$res['body']['data']['id'];
        $firstFileDiskPath = __DIR__ . '/../' . ltrim($res['body']['data']['file_path'], '/');
        assertAPI("Uploaded PDF exists on disk", file_exists($firstFileDiskPath) && is_file($firstFileDiskPath), "Disk Path: " . $firstFileDiskPath);
    }

    // Test 3: POST replacement upload (PDF v2)
    if ($createdSubmissionId) {
        // Sleep slightly to guarantee updated timestamp is greater if DB matches by seconds
        usleep(100000);
        $res = makeMultipartRequest("/api/assignments/{$activeAssignId}/submit", $tmpPdf, 'application/pdf', 'dummy_assignment_v2.pdf', 'mock-student-token');
        assertAPI("POST replacement submission succeeds with 201", $res['code'] === 201, "Code: " . $res['code']);
        
        // Old file must be unlinked/deleted from disk
        assertAPI("Previous submission file was deleted from disk", !file_exists($firstFileDiskPath), "Old File still exists: " . $firstFileDiskPath);
        
        $newFileDiskPath = __DIR__ . '/../' . ltrim($res['body']['data']['file_path'], '/');
        assertAPI("New replaced file exists on disk", file_exists($newFileDiskPath) && is_file($newFileDiskPath), "New Path: " . $newFileDiskPath);
        
        // Cleanup replaced file
        @unlink($newFileDiskPath);
    }

    // Test 4: POST upload double-extension malicious file
    $res = makeMultipartRequest("/api/assignments/{$activeAssignId}/submit", $tmpDoubleExt, 'application/pdf', 'exploit.php.pdf', 'mock-student-token');
    assertAPI("Double-extension exploit upload is blocked with 400", $res['code'] === 400, "Code: " . $res['code'] . " Msg: " . ($res['body']['message'] ?? ''));

    // Test 5: POST upload blocked extension (EXE)
    $res = makeMultipartRequest("/api/assignments/{$activeAssignId}/submit", $tmpExe, 'application/octet-stream', 'dummy_exploit.exe', 'mock-student-token');
    assertAPI("Forbidden extension (EXE) upload is blocked with 400", $res['code'] === 400, "Code: " . $res['code'] . " Msg: " . ($res['body']['message'] ?? ''));

    // Test 6: POST upload past deadline
    $res = makeMultipartRequest("/api/assignments/{$expiredAssignId}/submit", $tmpPdf, 'application/pdf', 'dummy_assignment.pdf', 'mock-student-token');
    assertAPI("Post-deadline submission is blocked with 400", $res['code'] === 400 && strpos(($res['body']['message'] ?? ''), 'deadline') !== false, "Code: " . $res['code'] . " Msg: " . ($res['body']['message'] ?? ''));

    if ($createdSubmissionId) {
        // Test 7: GET /api/submissions/{id} - Student 1 views own submission
        $res = makeRequest('GET', "/api/submissions/{$createdSubmissionId}", null, 'mock-student-token');
        assertAPI("Student retrieves own submission with 200", $res['code'] === 200 && (int)$res['body']['data']['id'] === $createdSubmissionId, "Code: " . $res['code']);

        // Test 8: GET /api/submissions/{id} - Student 2 blocked from viewing Student 1 submission
        $res = makeRequest('GET', "/api/submissions/{$createdSubmissionId}", null, $student2Token);
        assertAPI("Reading isolation: Other student is blocked with 403", $res['code'] === 403, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    }

    // Test 9: GET /api/submissions/my - List student's submissions
    $res = makeRequest('GET', "/api/submissions/my", null, 'mock-student-token');
    assertAPI("GET list of personal submissions returns 200", $res['code'] === 200 && is_array($res['body']['data']['submissions']), "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

} catch (Exception $e) {
    echo RED . "Exception during integration tests: " . $e->getMessage() . NC . "\n";
} finally {
    // Cleanup temporary files
    @unlink($tmpPdf);
    @unlink($tmpExe);
    @unlink($tmpDoubleExt);

    // Deleting created test assets to keep DB clean
    if ($activeAssignId) {
        $db->prepare("DELETE FROM assignment_submissions WHERE assignment_id = ?")->execute([$activeAssignId]);
        $db->prepare("DELETE FROM assignments WHERE id = ?")->execute([$activeAssignId]);
    }
    if ($expiredAssignId) {
        $db->prepare("DELETE FROM assignment_submissions WHERE assignment_id = ?")->execute([$expiredAssignId]);
        $db->prepare("DELETE FROM assignments WHERE id = ?")->execute([$expiredAssignId]);
    }

    // Stop build server
    echo "\n" . YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo "TEST RESULTS: " . ($testsPassed === $testsRun ? GREEN : RED) . "{$testsPassed} / {$testsRun} Tests Passed" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

exit($testsPassed === $testsRun ? 0 : 1);
