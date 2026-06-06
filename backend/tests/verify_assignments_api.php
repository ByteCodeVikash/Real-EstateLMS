<?php
/**
 * REST API Verification Script for Assignment CRUD Endpoints
 * Run via: php backend/tests/verify_assignments_api.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "ASSIGNMENT CRUD REST API INTEGRATION TESTING" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// 1. Fetch valid course and module to target in testing
$courseId = (int)$db->query("SELECT id FROM courses LIMIT 1")->fetchColumn();
$moduleId = (int)$db->query("SELECT id FROM course_modules WHERE course_id = $courseId LIMIT 1")->fetchColumn();

if (!$courseId) {
    echo RED . "Error: No courses found in database to perform API testing." . NC . "\n";
    exit(1);
}

// Save original role of user 1 to restore later
$originalUser1Role = $db->query("SELECT role FROM users WHERE id = 1")->fetchColumn() ?: 'student';

// Ensure the course is owned by ID 1 so mock-instructor (ID 1) passes permission guards
$db->prepare("UPDATE courses SET created_by = 1 WHERE id = ?")->execute([$courseId]);

// Ensure user ID 1 is enrolled as active student for student tests
$db->prepare("INSERT IGNORE INTO enrollments (user_id, course_id, progress, completion_status) VALUES (1, ?, 0, 'Active')")->execute([$courseId]);

echo "Targeting Course ID: {$courseId}, Module ID: " . ($moduleId ?: 'None') . "\n\n";

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

// Define HTTP request helper
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
    
    $data = json_decode($response, true);
    return [
        'code' => $httpCode,
        'body' => $data,
        'raw' => $response
    ];
}

$testsRun = 0;
$testsPassed = 0;
$createdAssignmentId = null;

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
    // ---------------------------------------------------------
    // Student Role Tests: set user ID 1 role to student
    // ---------------------------------------------------------
    $db->query("UPDATE users SET role = 'student' WHERE id = 1");

    // Test 1: GET /api/assignments (Unauthenticated)
    $res = makeRequest('GET', '/api/assignments');
    assertAPI("GET /api/assignments unauthenticated is blocked", $res['code'] === 401, "Code: " . $res['code']);

    // Test 2: GET /api/assignments (Student empty list or list)
    $res = makeRequest('GET', '/api/assignments', null, 'mock-student-token');
    assertAPI("GET /api/assignments for student returns 200", $res['code'] === 200, "Code: " . $res['code'] . " Msg: " . ($res['body']['message'] ?? ''));

    // Test 3: POST /api/assignments (Student - Blocked)
    $payload = [
        'course_id' => $courseId,
        'title' => 'Student API Assignment',
        'due_date' => '2026-12-31 23:59:59',
        'max_marks' => 100
    ];
    $res = makeRequest('POST', '/api/assignments', $payload, 'mock-student-token');
    assertAPI("POST /api/assignments for student is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

    // ---------------------------------------------------------
    // Instructor Role Tests: set user ID 1 role to instructor
    // ---------------------------------------------------------
    $db->query("UPDATE users SET role = 'instructor' WHERE id = 1");

    // Test 4: POST /api/assignments (Instructor - Valid)
    $payload = [
        'course_id' => $courseId,
        'module_id' => $moduleId ?: null,
        'title' => 'Instructor REST Assignment',
        'description' => 'Created via REST API testing.',
        'instructions' => 'Follow REST rules.',
        'due_date' => '2026-12-31 23:59:59',
        'max_marks' => 100,
        'status' => 'Published'
    ];
    $res = makeRequest('POST', '/api/assignments', $payload, 'mock-instructor-token');
    $success = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST /api/assignments instructor creates assignment successfully", $success, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    if ($success) {
        $createdAssignmentId = (int)$res['body']['data']['id'];
    }

    // Test 5: POST /api/assignments (Instructor - Validation Error)
    $invalidPayload = [
        'course_id' => $courseId,
        'title' => '', // empty title
        'due_date' => 'invalid-date',
        'max_marks' => -50
    ];
    $res = makeRequest('POST', '/api/assignments', $invalidPayload, 'mock-instructor-token');
    assertAPI("POST /api/assignments validates invalid data", $res['code'] === 400, "Code: " . $res['code']);

    if ($createdAssignmentId) {
        // Test 6: GET /api/assignments/{id} (Student - Allowed)
        // Temporarily reset user 1's role to student for student access checks
        $db->query("UPDATE users SET role = 'student' WHERE id = 1");
        $res = makeRequest('GET', '/api/assignments/' . $createdAssignmentId, null, 'mock-student-token');
        assertAPI("GET /api/assignments/{id} retrieves detail for student", $res['code'] === 200 && $res['body']['data']['title'] === 'Instructor REST Assignment', "Code: " . $res['code']);

        // Set back to instructor for instructor actions
        $db->query("UPDATE users SET role = 'instructor' WHERE id = 1");

        // Test 7: PUT /api/assignments/{id} (Instructor - Valid)
        $updatePayload = [
            'title' => 'Instructor REST Assignment Updated',
            'max_marks' => 80
        ];
        $res = makeRequest('PUT', '/api/assignments/' . $createdAssignmentId, $updatePayload, 'mock-instructor-token');
        assertAPI("PUT /api/assignments/{id} updates assignment details", $res['code'] === 200 && $res['body']['data']['max_marks'] === 80, "Code: " . $res['code']);

        // Set to student for student edit/delete test blocks
        $db->query("UPDATE users SET role = 'student' WHERE id = 1");

        // Test 8: PUT /api/assignments/{id} (Student - Blocked)
        $res = makeRequest('PUT', '/api/assignments/' . $createdAssignmentId, ['title' => 'Student Try'], 'mock-student-token');
        assertAPI("PUT /api/assignments/{id} student edit is blocked", $res['code'] === 403, "Code: " . $res['code']);

        // Test 9: DELETE /api/assignments/{id} (Student - Blocked)
        $res = makeRequest('DELETE', '/api/assignments/' . $createdAssignmentId, null, 'mock-student-token');
        assertAPI("DELETE /api/assignments/{id} student delete is blocked", $res['code'] === 403, "Code: " . $res['code']);

        // Set back to instructor for deletion action
        $db->query("UPDATE users SET role = 'instructor' WHERE id = 1");

        // Test 10: DELETE /api/assignments/{id} (Instructor - Success)
        $res = makeRequest('DELETE', '/api/assignments/' . $createdAssignmentId, null, 'mock-instructor-token');
        assertAPI("DELETE /api/assignments/{id} instructor delete succeeds", $res['code'] === 200, "Code: " . $res['code']);

        // Test 11: GET /api/assignments/{id} (After delete - 404)
        $res = makeRequest('GET', '/api/assignments/' . $createdAssignmentId, null, 'mock-instructor-token');
        assertAPI("GET /api/assignments/{id} returns 404 after deletion", $res['code'] === 404, "Code: " . $res['code']);
    } else {
        echo RED . "Skipping detail and write REST tests because assignment creation failed." . NC . "\n";
    }

} finally {
    // Restore user 1 original role
    $db->prepare("UPDATE users SET role = ? WHERE id = 1")->execute([$originalUser1Role]);

    // 3. Cleanup: Stop built-in web server
    echo "\n" . YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "API VERIFICATION COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    echo GREEN . "All CRUD REST API endpoints fully conform to validation, authorization, and output requirements!" . NC . "\n";
    exit(0);
} else {
    echo RED . "Some REST API verification tests failed." . NC . "\n";
    exit(1);
}
