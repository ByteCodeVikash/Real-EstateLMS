<?php
/**
 * REST API Verification Script for Assignment Grading Endpoints
 * Run via: php backend/tests/verify_grading_api.php
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
echo YELLOW . "ASSIGNMENT GRADING API INTEGRATION TESTING" . NC . "\n";
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
    (100, 'Admin User', 'admin@realtypro.com', 'dummy_pass', 'admin', 'Active'),
    (101, 'Instructor User', 'instructor@realtypro.com', 'dummy_pass', 'instructor', 'Active'),
    (102, 'Other Instructor', 'other_inst@realtypro.com', 'dummy_pass', 'instructor', 'Active')");

// Ensure the course has creator set to Instructor User (ID 101) for ownership validation
$db->prepare("UPDATE courses SET created_by = 101 WHERE id = ?")->execute([$courseId]);

// Enrolled student
$db->prepare("INSERT IGNORE INTO enrollments (user_id, course_id, progress, completion_status) VALUES (1, ?, 0, 'Active')")->execute([$courseId]);

// Generate actual JWTs for roles
$studentToken = JWT::encode(['id' => 1, 'full_name' => 'Sarah Jenkins', 'email' => 'sarah.j@realtypro.com', 'role' => 'student']);
$adminToken = JWT::encode(['id' => 100, 'full_name' => 'Admin User', 'email' => 'admin@realtypro.com', 'role' => 'admin']);
$instructorToken = JWT::encode(['id' => 101, 'full_name' => 'Instructor User', 'email' => 'instructor@realtypro.com', 'role' => 'instructor']);
$otherInstructorToken = JWT::encode(['id' => 102, 'full_name' => 'Other Instructor', 'email' => 'other_inst@realtypro.com', 'role' => 'instructor']);

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

$assignId = null;
$submissionId = null;

try {
    // Setup test assignment (max 100 marks)
    $stmt1 = $db->prepare("INSERT INTO assignments (course_id, title, max_marks, due_date, status, created_by) VALUES (?, 'Grading Test Assignment', 100, ?, 'Published', 101)");
    $stmt1->execute([$courseId, date('Y-m-d H:i:s', time() + 31536000)]);
    $assignId = (int)$db->lastInsertId();
    
    // Setup student submission
    $stmt2 = $db->prepare("INSERT INTO assignment_submissions (assignment_id, student_id, file_path, submitted_at, status) VALUES (?, 1, '/uploads/assignments/sarah_gradetest.pdf', NOW(), 'Submitted')");
    $stmt2->execute([$assignId]);
    $submissionId = (int)$db->lastInsertId();

    echo "Prepared Assignment ID: {$assignId}\n";
    echo "Prepared Submission ID: {$submissionId}\n\n";

    // -------------------------------------------------------------------------
    // Integration Tests
    // -------------------------------------------------------------------------

    // Test 1: GET submissions list unauthenticated
    $res = makeRequest('GET', "/api/submissions/course/{$courseId}");
    assertAPI("GET submissions list unauthenticated is blocked with 401", $res['code'] === 401, "Code: " . $res['code']);

    // Test 2: GET submissions list with Student token
    $res = makeRequest('GET', "/api/submissions/course/{$courseId}", null, $studentToken);
    assertAPI("GET submissions list with Student token is blocked with 403", $res['code'] === 403, "Code: " . $res['code']);

    // Test 3: GET submissions list with unrelated Instructor token
    $res = makeRequest('GET', "/api/submissions/course/{$courseId}", null, $otherInstructorToken);
    assertAPI("GET submissions list with unrelated Instructor is blocked with 403", $res['code'] === 403, "Code: " . $res['code']);

    // Test 4: GET submissions list with owner Instructor token
    $res = makeRequest('GET', "/api/submissions/course/{$courseId}", null, $instructorToken);
    assertAPI("GET submissions list with owner Instructor succeeds with 200", $res['code'] === 200 && is_array($res['body']['data']['submissions']), "Code: " . $res['code']);

    // Test 5: GET submissions list with Admin token
    $res = makeRequest('GET', "/api/submissions/course/{$courseId}", null, $adminToken);
    $checkList = ($res['code'] === 200 && is_array($res['body']['data']['submissions']) && count($res['body']['data']['submissions']) > 0);
    assertAPI("GET submissions list with Admin succeeds with 200 and loads submissions", $checkList, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

    // Test 6: POST grade unauthenticated
    $res = makeRequest('POST', "/api/submissions/{$submissionId}/grade", ['status' => 'Graded', 'marks' => 85, 'feedback' => 'Good']);
    assertAPI("POST grade unauthenticated is blocked with 401", $res['code'] === 401, "Code: " . $res['code']);

    // Test 7: POST grade with Student token
    $res = makeRequest('POST', "/api/submissions/{$submissionId}/grade", ['status' => 'Graded', 'marks' => 85, 'feedback' => 'Good'], $studentToken);
    assertAPI("POST grade with Student token is blocked with 403", $res['code'] === 403, "Code: " . $res['code']);

    // Test 8: POST grade with unrelated Instructor token
    $res = makeRequest('POST', "/api/submissions/{$submissionId}/grade", ['status' => 'Graded', 'marks' => 85, 'feedback' => 'Good'], $otherInstructorToken);
    assertAPI("POST grade with unrelated Instructor token is blocked with 403", $res['code'] === 403, "Code: " . $res['code']);

    // Test 9: POST grade validation error (marks > max_marks)
    $res = makeRequest('POST', "/api/submissions/{$submissionId}/grade", ['status' => 'Graded', 'marks' => 150, 'feedback' => 'Impossible score'], $instructorToken);
    assertAPI("POST grade validation flags score exceeding maximum with 422", $res['code'] === 422, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

    // Test 10: POST grade validation error (invalid status value)
    $res = makeRequest('POST', "/api/submissions/{$submissionId}/grade", ['status' => 'InvalidStatus', 'marks' => 80, 'feedback' => 'Bad status'], $instructorToken);
    assertAPI("POST grade validation flags invalid status value with 422", $res['code'] === 422, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

    // Test 11: POST grade success (Under Review, marks null/empty)
    $res = makeRequest('POST', "/api/submissions/{$submissionId}/grade", ['status' => 'Under Review', 'feedback' => 'Looking it over.'], $instructorToken);
    $successUnderReview = ($res['code'] === 200 && $res['body']['data']['status'] === 'Under Review' && $res['body']['data']['marks'] === null);
    assertAPI("POST grade setting Under Review status succeeds with 200", $successUnderReview, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

    // Test 12: POST grade success (Graded, 90 marks) by Admin
    $res = makeRequest('POST', "/api/submissions/{$submissionId}/grade", ['status' => 'Graded', 'marks' => 90, 'feedback' => 'Excellent work by Admin.'], $adminToken);
    $successGraded = ($res['code'] === 200 && $res['body']['data']['status'] === 'Graded' && (int)$res['body']['data']['marks'] === 90 && $res['body']['data']['feedback'] === 'Excellent work by Admin.');
    assertAPI("POST grade setting Graded status by Admin succeeds with 200", $successGraded, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

} catch (Exception $e) {
    echo RED . "Exception during integration tests: " . $e->getMessage() . NC . "\n";
} finally {
    // Cleanup database
    if ($assignId) {
        $db->prepare("DELETE FROM assignment_submissions WHERE assignment_id = ?")->execute([$assignId]);
        $db->prepare("DELETE FROM assignments WHERE id = ?")->execute([$assignId]);
    }
    
    // Stop server
    echo "\n" . YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo "TEST RESULTS: " . ($testsPassed === $testsRun ? GREEN : RED) . "{$testsPassed} / {$testsRun} Tests Passed" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

exit($testsPassed === $testsRun ? 0 : 1);
