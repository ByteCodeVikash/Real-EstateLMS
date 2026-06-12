<?php
/**
 * REST API Verification Script for Enrollment Endpoints
 * Run via: php backend/tests/verify_enrollments_api.php
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
echo YELLOW . "ENROLLMENT REST API INTEGRATION TESTING" . NC . "\n";
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
$student1Id = 9001;
$student2Id = 9002;
$instructorId = 9003;
$adminId = 9004;

// Clean up any old test data first to ensure clean execution state
$db->exec("DELETE FROM enrollments WHERE user_id IN ($student1Id, $student2Id, $instructorId, $adminId)");
$db->exec("DELETE FROM courses WHERE id IN (9001, 9002, 9003)");
$db->exec("DELETE FROM categories WHERE id = 9001");
$db->exec("DELETE FROM admins WHERE id = $adminId OR email = 'admin@realtypro.com'");
$db->exec("DELETE FROM users WHERE id IN ($student1Id, $student2Id, $instructorId, $adminId) OR email IN ('student1@realtypro.com', 'student2@realtypro.com', 'instructor@realtypro.com', 'admin@realtypro.com')");

// Ensure test users exist in DB
$db->query("INSERT INTO users (id, full_name, email, password_hash, role, status) VALUES 
    ($student1Id, 'Test Student One', 'student1@realtypro.com', 'dummy_pass', 'student', 'Active'),
    ($student2Id, 'Test Student Two', 'student2@realtypro.com', 'dummy_pass', 'student', 'Active'),
    ($instructorId, 'Test Instructor', 'instructor@realtypro.com', 'dummy_pass', 'instructor', 'Active')");

// Admins are checked in admins table first, then users table. Insert into both to satisfy auth middleware checks
$db->query("INSERT INTO admins (id, full_name, name, email, password_hash, status, role) VALUES 
    ($adminId, 'Test Admin', 'Test Admin', 'admin@realtypro.com', 'dummy_pass', 'Active', 'Super Admin')");
$db->query("INSERT INTO users (id, full_name, email, password_hash, role, status) VALUES 
    ($adminId, 'Test Admin', 'admin@realtypro.com', 'dummy_pass', 'admin', 'Active')");

// Insert a category
$db->query("INSERT INTO categories (id, name, slug, status) VALUES 
    (9001, 'Test Enrollment Category', 'test-enrollment-cat', 'Active')");

// Insert courses
$db->query("INSERT INTO courses (id, category_id, title, slug, mentor_name, price, status, created_by) VALUES 
    (9001, 9001, 'Test Enrollment Course Admin Published', 'test-enroll-course-admin-pub', 'Admin Mentor', 0.00, 'Published', $adminId),
    (9002, 9001, 'Test Enrollment Course Admin Draft', 'test-enroll-course-admin-draft', 'Admin Mentor', 0.00, 'Draft', $adminId),
    (9003, 9001, 'Test Enrollment Course Instructor Published', 'test-enroll-course-inst-pub', 'Instructor Mentor', 0.00, 'Published', $instructorId)");

// Generate JWT tokens for test roles
$student1Token = JWT::encode(['id' => $student1Id, 'full_name' => 'Test Student One', 'email' => 'student1@realtypro.com', 'role' => 'student']);
$student2Token = JWT::encode(['id' => $student2Id, 'full_name' => 'Test Student Two', 'email' => 'student2@realtypro.com', 'role' => 'student']);
$instructorToken = JWT::encode(['id' => $instructorId, 'full_name' => 'Test Instructor', 'email' => 'instructor@realtypro.com', 'role' => 'instructor']);
$adminToken = JWT::encode(['id' => $adminId, 'full_name' => 'Test Admin', 'email' => 'admin@realtypro.com', 'role' => 'admin']);

// Start built-in PHP web server on localhost:8091 in background
echo YELLOW . "Starting PHP built-in web server on 127.0.0.1:8091..." . NC . "\n";
$serverProcess = proc_open("exec php -S 127.0.0.1:8091 backend/index.php", [
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
    $url = "http://127.0.0.1:8091" . $path;
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
$enrollmentId1 = null;
$enrollmentId2 = null;

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
    // -------------------------------------------------------------------------
    // 1. Create Enrollment Tests
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- 1. Create Enrollment Tests ---" . NC . "\n";

    // Test 1.1: Unauthenticated Creation
    $res = makeRequest('POST', '/api/enrollments', ['course_id' => 9001]);
    assertAPI("Create enrollment unauthenticated is blocked", $res['code'] === 401, "Code: " . $res['code']);

    // Test 1.2: Student Enrolls in Published Course
    $res = makeRequest('POST', '/api/enrollments', ['course_id' => 9001], $student1Token);
    $success1 = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("Create enrollment (Student - Published Course) succeeds", $success1, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    if ($success1) {
        $enrollmentId1 = (int)$res['body']['data']['id'];
    }

    // Test 1.3: Admin Enrolls Student 2 in Published Course
    $res = makeRequest('POST', '/api/enrollments', [
        'course_id' => 9001,
        'user_id' => $student2Id
    ], $adminToken);
    $success2 = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("Create enrollment (Admin - Enroll Student 2) succeeds", $success2, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    if ($success2) {
        $enrollmentId2 = (int)$res['body']['data']['id'];
    }

    // Test 1.4: Duplicate Enrollment Prevention
    $res = makeRequest('POST', '/api/enrollments', ['course_id' => 9001], $student1Token);
    assertAPI("Duplicate enrollment prevention returns 400 Bad Request", $res['code'] === 400, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

    // Test 1.5: Validation Failure (Draft/Non-published Course)
    $res = makeRequest('POST', '/api/enrollments', ['course_id' => 9002], $student1Token);
    assertAPI("Enrolling in Draft/Non-published course returns 400 Bad Request", $res['code'] === 400, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

    // Test 1.6: Validation Failure (Missing course_id)
    $res = makeRequest('POST', '/api/enrollments', [], $student1Token);
    assertAPI("Create enrollment without course_id returns 400 Bad Request", $res['code'] === 400, "Code: " . $res['code']);

    // -------------------------------------------------------------------------
    // 2. Enrollment Details & Invalid IDs Tests
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- 2. Enrollment Details & Invalid IDs Tests ---" . NC . "\n";

    if ($enrollmentId1 && $enrollmentId2) {
        // Test 2.1: Owner Retrieves own details
        $res = makeRequest('GET', "/api/enrollments/{$enrollmentId1}", null, $student1Token);
        assertAPI("Owner (Student 1) retrieves own enrollment details", $res['code'] === 200 && (int)$res['body']['data']['id'] === $enrollmentId1, "Code: " . $res['code']);

        // Test 2.2: Student blocked from retrieving other's details
        $res = makeRequest('GET', "/api/enrollments/{$enrollmentId2}", null, $student1Token);
        assertAPI("Student 1 blocked from retrieving Student 2's enrollment details", $res['code'] === 403, "Code: " . $res['code']);

        // Test 2.3: Admin retrieves student's details
        $res = makeRequest('GET', "/api/enrollments/{$enrollmentId1}", null, $adminToken);
        assertAPI("Admin retrieves student's enrollment details", $res['code'] === 200, "Code: " . $res['code']);

        // Test 2.4: Invalid ID returns 400 Bad Request
        $res = makeRequest('GET', '/api/enrollments/0', null, $student1Token);
        assertAPI("Get enrollment with ID 0 returns 400", $res['code'] === 400, "Code: " . $res['code']);

        // Test 2.5: Non-existent ID returns 404 Not Found
        $res = makeRequest('GET', '/api/enrollments/999999', null, $student1Token);
        assertAPI("Get enrollment with non-existent ID returns 404", $res['code'] === 404, "Code: " . $res['code']);
    }

    // -------------------------------------------------------------------------
    // 3. Update Enrollment & Progress Updates Tests
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- 3. Update Enrollment & Progress Updates ---" . NC . "\n";

    if ($enrollmentId1) {
        // Test 3.1: Student Updates Own Progress
        $res = makeRequest('PUT', "/api/enrollments/{$enrollmentId1}", ['progress' => 50], $student1Token);
        assertAPI("Student updates progress to 50%", $res['code'] === 200 && (int)$res['body']['data']['progress'] === 50, "Code: " . $res['code']);

        // Test 3.2: Invalid Progress values (Negative)
        $res = makeRequest('PUT', "/api/enrollments/{$enrollmentId1}", ['progress' => -10], $student1Token);
        assertAPI("Setting progress to negative value returns 400", $res['code'] === 400, "Code: " . $res['code']);

        // Test 3.3: Invalid Progress values (> 100)
        $res = makeRequest('PUT', "/api/enrollments/{$enrollmentId1}", ['progress' => 120], $student1Token);
        assertAPI("Setting progress to value > 100 returns 400", $res['code'] === 400, "Code: " . $res['code']);

        // Test 3.4: Auto-triggering completion status and certificate when progress is 100%
        $res = makeRequest('PUT', "/api/enrollments/{$enrollmentId1}", ['progress' => 100], $student1Token);
        $triggered = ($res['code'] === 200 && $res['body']['data']['completion_status'] === 'Completed' && (int)$res['body']['data']['certificate_issued'] === 1);
        assertAPI("Setting progress to 100% automatically completes enrollment and issues certificate", $triggered, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

        // Test 3.5: Student Privilege Escalation Prevention (Student tries to update certificate status directly)
        // Set progress back to 60 using Admin token first
        makeRequest('PUT', "/api/enrollments/{$enrollmentId1}", ['progress' => 60, 'certificate_issued' => 0, 'completion_status' => 'Active'], $adminToken);
        
        $res = makeRequest('PUT', "/api/enrollments/{$enrollmentId1}", [
            'progress' => 80,
            'certificate_issued' => 1,
            'completion_status' => 'Completed'
        ], $student1Token);
        $escalationPrevented = ($res['code'] === 200 && (int)$res['body']['data']['progress'] === 80 && (int)$res['body']['data']['certificate_issued'] === 0 && $res['body']['data']['completion_status'] === 'Active');
        assertAPI("Student cannot manually update certificate_issued or completion_status during progress update", $escalationPrevented, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

        // Test 3.6: Student Privilege Escalation Prevention (Student tries to update certificate status directly without progress)
        $res = makeRequest('PUT', "/api/enrollments/{$enrollmentId1}", [
            'certificate_issued' => 1
        ], $student1Token);
        assertAPI("Student trying to update certificate without progress returns 403 Forbidden", $res['code'] === 403, "Code: " . $res['code']);
    }

    // -------------------------------------------------------------------------
    // 4. Listing, User Filter & Course Filter Tests
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- 4. Listing, User Filter & Course Filter ---" . NC . "\n";

    if ($enrollmentId1 && $enrollmentId2) {
        // Test 4.1: Admin lists all enrollments
        $res = makeRequest('GET', '/api/enrollments', null, $adminToken);
        $ids = array_column($res['body']['data']['enrollments'] ?? [], 'id');
        $adminListsAll = ($res['code'] === 200 && in_array($enrollmentId1, $ids) && in_array($enrollmentId2, $ids));
        assertAPI("Admin retrieves list of all enrollments", $adminListsAll, "Code: " . $res['code'] . " Found IDs: " . implode(',', $ids));

        // Test 4.2: Student lists own enrollments (only shows own)
        $res = makeRequest('GET', '/api/enrollments', null, $student1Token);
        $ids = array_column($res['body']['data']['enrollments'] ?? [], 'id');
        $studentListsOwnOnly = ($res['code'] === 200 && in_array($enrollmentId1, $ids) && !in_array($enrollmentId2, $ids));
        assertAPI("Student lists own enrollments and is isolated from other students", $studentListsOwnOnly, "Code: " . $res['code'] . " Found IDs: " . implode(',', $ids));

        // Test 4.3: User Filter (Admin filters by student 2)
        $res = makeRequest('GET', "/api/enrollments?user_id={$student2Id}", null, $adminToken);
        $ids = array_column($res['body']['data']['enrollments'] ?? [], 'id');
        $userFilterAdminOk = ($res['code'] === 200 && in_array($enrollmentId2, $ids) && !in_array($enrollmentId1, $ids));
        assertAPI("Admin filters enrollment list by user_id", $userFilterAdminOk, "Code: " . $res['code'] . " Found IDs: " . implode(',', $ids));

        // Test 4.4: User Filter (Student tries to filter by other user_id -> 403)
        $res = makeRequest('GET', "/api/enrollments?user_id={$student2Id}", null, $student1Token);
        assertAPI("Student filtering list by another user_id returns 403 Forbidden", $res['code'] === 403, "Code: " . $res['code']);

        // Test 4.5: Course Filter (Admin filters by course_id 9001)
        $res = makeRequest('GET', '/api/enrollments?course_id=9001', null, $adminToken);
        $ids = array_column($res['body']['data']['enrollments'] ?? [], 'id');
        $courseFilterOk = ($res['code'] === 200 && in_array($enrollmentId1, $ids) && in_array($enrollmentId2, $ids));
        assertAPI("Admin filters enrollment list by course_id", $courseFilterOk, "Code: " . $res['code'] . " Found IDs: " . implode(',', $ids));

        // Test 4.6: GET /api/my-courses unauthenticated is blocked
        $res = makeRequest('GET', '/api/my-courses');
        assertAPI("GET /api/my-courses unauthenticated is blocked", $res['code'] === 401, "Code: " . $res['code']);

        // Test 4.7: GET /api/my-courses returns enrolled courses for student
        $res = makeRequest('GET', '/api/my-courses', null, $student1Token);
        $myCourses = $res['body']['data'] ?? [];
        $courseIds = array_column($myCourses, 'id');
        $myCoursesOk = ($res['code'] === 200 && is_array($myCourses) && in_array(9001, $courseIds));
        assertAPI("GET /api/my-courses returns enrolled courses for authenticated student", $myCoursesOk, "Code: " . $res['code'] . " Found Course IDs: " . implode(',', $courseIds));
    }

    // -------------------------------------------------------------------------
    // 5. Delete Enrollment Tests
    // -------------------------------------------------------------------------
    echo "\n" . YELLOW . "--- 5. Delete Enrollment Tests ---" . NC . "\n";

    if ($enrollmentId1) {
        // Test 5.1: Student Try to Delete (Forbidden 403)
        $res = makeRequest('DELETE', "/api/enrollments/{$enrollmentId1}", null, $student1Token);
        assertAPI("Student cannot delete enrollment record", $res['code'] === 403, "Code: " . $res['code']);

        // Test 5.2: Instructor Try to Delete Course Enrollment they do not own (Forbidden 403)
        // Course 9001 was created by Admin. Test Instructor tries to delete Student 1's enrollment in Course 9001.
        $res = makeRequest('DELETE', "/api/enrollments/{$enrollmentId1}", null, $instructorToken);
        assertAPI("Instructor cannot delete enrollment for course they did not create", $res['code'] === 403, "Code: " . $res['code']);

        // Test 5.3: Instructor deletes enrollment of course they created
        // Enroll Student 1 in Course 9003 (created by Instructor)
        $enrollInstCourse = makeRequest('POST', '/api/enrollments', [
            'course_id' => 9003,
            'user_id' => $student1Id
        ], $adminToken);
        $instEnrollId = $enrollInstCourse['body']['data']['id'] ?? null;
        if ($instEnrollId) {
            $res = makeRequest('DELETE', "/api/enrollments/{$instEnrollId}", null, $instructorToken);
            assertAPI("Instructor deletes enrollment for a course they created", $res['code'] === 200, "Code: " . $res['code']);
        } else {
            assertAPI("Instructor deletes enrollment for a course they created (Enrollment setup failed)", false);
        }

        // Test 5.4: Admin Deletes Enrollment (Success 200)
        $res = makeRequest('DELETE', "/api/enrollments/{$enrollmentId1}", null, $adminToken);
        assertAPI("Admin deletes enrollment successfully", $res['code'] === 200, "Code: " . $res['code']);

        // Test 5.5: Verified Deleted Enrollment returns 404
        $res = makeRequest('GET', "/api/enrollments/{$enrollmentId1}", null, $adminToken);
        assertAPI("Retrieving deleted enrollment returns 404 Not Found", $res['code'] === 404, "Code: " . $res['code']);
    }

} finally {
    // Clean up test data
    echo "\n" . YELLOW . "Cleaning up test assets from database..." . NC . "\n";
    $db->exec("DELETE FROM enrollments WHERE user_id IN ($student1Id, $student2Id, $instructorId, $adminId)");
    $db->exec("DELETE FROM courses WHERE id IN (9001, 9002, 9003)");
    $db->exec("DELETE FROM categories WHERE id = 9001");
    $db->exec("DELETE FROM admins WHERE id = $adminId");
    $db->exec("DELETE FROM users WHERE id IN ($student1Id, $student2Id, $instructorId, $adminId)");

    // Shut down PHP built-in web server
    echo YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "ENROLLMENT REST API INTEGRATION COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    echo GREEN . "All 11 required test cases passed successfully!" . NC . "\n";
    exit(0);
} else {
    echo RED . "Some tests failed. Please review execution details." . NC . "\n";
    exit(1);
}
