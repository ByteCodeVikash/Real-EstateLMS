<?php
/**
 * Automated LMS Core Backend Audit and Test Suite
 * Run via: php backend/tests/run_backend_audit_tests.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';

$baseUrl = 'http://127.0.0.1:8090';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

$testsRun = 0;
$testsPassed = 0;
$findings = [];

function makeRequest($method, $path, $data = null, $token = null) {
    global $baseUrl;
    $ch = curl_init($baseUrl . $path);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $headers = [
        'Content-Type: application/json'
    ];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $decoded = json_decode($response, true);
    return [
        'code' => $httpCode,
        'body' => $decoded,
        'raw' => $response
    ];
}

function assertTest($name, $expression, $failureMessage = '') {
    global $testsRun, $testsPassed, $findings;
    $testsRun++;
    if ($expression) {
        $testsPassed++;
        echo GREEN . "  [PASS] " . NC . $name . "\n";
    } else {
        echo RED . "  [FAIL] " . NC . $name . "\n";
        if ($failureMessage) {
            echo "         Reason: " . $failureMessage . "\n";
            $findings[] = "[FAIL] " . $name . " - " . $failureMessage;
        } else {
            $findings[] = "[FAIL] " . $name;
        }
    }
}

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "LMS CORE BACKEND AUDIT STARTING" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// -----------------------------------------------------------------------------
// PRE-FLIGHT: LOGINS & TOKEN RETRIEVAL
// -----------------------------------------------------------------------------
echo YELLOW . "Logging in mock users to retrieve JWT tokens..." . NC . "\n";

$adminLogin = makeRequest('POST', '/api/auth/login', [
    'email' => 'admin@bgrealtyacademy.com',
    'password' => 'password123'
]);
$adminToken = $adminLogin['body']['data']['token'] ?? null;
assertTest("Admin Login", $adminLogin['code'] === 200 && !empty($adminToken), "Failed to retrieve admin token: " . ($adminLogin['body']['message'] ?? ''));

$instructorLogin = makeRequest('POST', '/api/auth/login', [
    'email' => 'instructor@bgrealtyacademy.com',
    'password' => 'password123'
]);
$instructorToken = $instructorLogin['body']['data']['token'] ?? null;
assertTest("Instructor Login", $instructorLogin['code'] === 200 && !empty($instructorToken), "Failed to retrieve instructor token: " . ($instructorLogin['body']['message'] ?? ''));

$studentLogin = makeRequest('POST', '/api/auth/login', [
    'email' => 'student@bgrealtyacademy.com',
    'password' => 'password123'
]);
$studentToken = $studentLogin['body']['data']['token'] ?? null;
assertTest("Student Login", $studentLogin['code'] === 200 && !empty($studentToken), "Failed to retrieve student token: " . ($studentLogin['body']['message'] ?? ''));

$superadminLogin = makeRequest('POST', '/api/auth/login', [
    'email' => 'superadmin@bgrealtyacademy.com',
    'password' => 'password123'
]);
$superadminToken = $superadminLogin['body']['data']['token'] ?? null;
assertTest("Super Admin Login", $superadminLogin['code'] === 200 && !empty($superadminToken), "Failed to retrieve superadmin token");

if (!$adminToken || !$instructorToken || !$studentToken) {
    echo RED . "Critical failure: cannot retrieve tokens. Stopping." . NC . "\n";
    exit(1);
}

$studentId = $studentLogin['body']['data']['user']['id'];
$instructorId = $instructorLogin['body']['data']['user']['id'];
$adminId = $adminLogin['body']['data']['user']['id'];

// -----------------------------------------------------------------------------
// MODULE 1: COURSE CATEGORIES CRUD & VALIDATION
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 1. Course Categories Testing ---" . NC . "\n";

// A. Create Category
$catSlug = "audit-test-cat-" . time();
$createCat = makeRequest('POST', '/api/categories', [
    'name' => 'Audit Test Category',
    'slug' => $catSlug,
    'description' => 'Used for testing backend audit controls.',
    'icon' => 'Award',
    'status' => 'Active'
], $adminToken);

$newCatId = $createCat['body']['data']['id'] ?? 0;
assertTest("Create Category", $createCat['code'] === 201 && $newCatId > 0, "Response code: " . $createCat['code'] . ", body: " . json_encode($createCat['body']));

// B. Try Duplicate Category Slug
$duplicateCat = makeRequest('POST', '/api/categories', [
    'name' => 'Duplicate Audit Category',
    'slug' => $catSlug,
    'description' => 'Should fail due to duplicate slug.',
    'icon' => 'Award',
    'status' => 'Active'
], $adminToken);
assertTest("Duplicate Category Slug Prevention", $duplicateCat['code'] === 409, "Allowed duplicate slug or returned wrong code: " . $duplicateCat['code']);

// C. Try Invalid Category Input (empty name)
$invalidCat = makeRequest('POST', '/api/categories', [
    'name' => '',
    'slug' => 'some-slug',
    'status' => 'Active'
], $adminToken);
assertTest("Invalid Input Handling (Empty Name)", $invalidCat['code'] === 400, "Allowed empty name category creation: " . $invalidCat['code']);

// D. Fetch Category
$fetchCat = makeRequest('GET', "/api/categories/{$newCatId}", null, $studentToken);
assertTest("Fetch Category", $fetchCat['code'] === 200 && ($fetchCat['body']['data']['name'] ?? '') === 'Audit Test Category', "Failed to retrieve category or returned mismatch");

// E. Fetch Category List
$fetchCatList = makeRequest('GET', "/api/categories", null, $studentToken);
$hasNewCat = false;
if (is_array($fetchCatList['body']['data'] ?? null)) {
    foreach ($fetchCatList['body']['data'] as $cat) {
        if ((int)$cat['id'] === (int)$newCatId) {
            $hasNewCat = true;
            break;
        }
    }
}
assertTest("Fetch Category List contains new category", $fetchCatList['code'] === 200 && $hasNewCat, "New category not found in list");

// F. Update Category
$updateCat = makeRequest('PUT', "/api/categories/{$newCatId}", [
    'name' => 'Audit Test Category Updated',
    'slug' => $catSlug,
    'description' => 'Updated test description.',
    'icon' => 'Award',
    'status' => 'Active'
], $adminToken);
assertTest("Update Category", $updateCat['code'] === 200 && ($updateCat['body']['data']['name'] ?? '') === 'Audit Test Category Updated', "Update failed");

// -----------------------------------------------------------------------------
// MODULE 2: COURSES CRUD & SEARCH/PAGINATION/FILTERING
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 2. Courses Testing ---" . NC . "\n";

// A. Create Course (Admin)
$courseSlug = "audit-course-slug-" . time();
$createCourse = makeRequest('POST', '/api/courses', [
    'category_id' => $newCatId,
    'title' => 'Audit Test Course Title',
    'slug' => $courseSlug,
    'description' => 'Audit course description detail.',
    'thumbnail' => 'grad-blue',
    'mentor_name' => 'Audit Mentor',
    'duration' => '6 Weeks',
    'price' => 250.00,
    'status' => 'Published'
], $adminToken);
$newCourseId = $createCourse['body']['data']['id'] ?? 0;
assertTest("Create Course (Admin)", $createCourse['code'] === 201 && $newCourseId > 0, "Failed creating course: " . $createCourse['code']);

// B. Course Slug Uniqueness
$dupCourse = makeRequest('POST', '/api/courses', [
    'category_id' => $newCatId,
    'title' => 'Dup Course Title',
    'slug' => $courseSlug,
    'price' => 100.00,
    'status' => 'Draft'
], $adminToken);
assertTest("Duplicate Course Slug Prevention", $dupCourse['code'] === 409, "Allowed duplicate course slug: " . $dupCourse['code']);

// C. Retrieve Course by ID
$fetchCourse = makeRequest('GET', "/api/courses/{$newCourseId}", null, $studentToken);
assertTest("Retrieve Course by ID", $fetchCourse['code'] === 200 && ($fetchCourse['body']['data']['title'] ?? '') === 'Audit Test Course Title', "Failed fetching course details");

// D. Search and Filtering
$searchCourse = makeRequest('GET', "/api/courses?search=Audit+Test+Course", null, $studentToken);
$hasSearchCourse = false;
if (is_array($searchCourse['body']['data']['courses'] ?? null)) {
    foreach ($searchCourse['body']['data']['courses'] as $c) {
        if ((int)$c['id'] === (int)$newCourseId) {
            $hasSearchCourse = true;
            break;
        }
    }
}
assertTest("Course Search and Keyword Filtering", $searchCourse['code'] === 200 && $hasSearchCourse, "Course not found in search results");

// E. Pagination Test
$paginateCourse = makeRequest('GET', "/api/courses?limit=1&page=1", null, $studentToken);
assertTest("Course Pagination Structure", $paginateCourse['code'] === 200 && isset($paginateCourse['body']['data']['pagination']['total_pages']), "Pagination metadata is missing");

// F. Instructor own courses access check
$createInstructorCourse = makeRequest('POST', '/api/courses', [
    'category_id' => $newCatId,
    'title' => 'Instructor Own Course',
    'slug' => 'instructor-own-course-' . time(),
    'price' => 120.00,
    'status' => 'Draft'
], $instructorToken);
$instCourseId = $createInstructorCourse['body']['data']['id'] ?? 0;
assertTest("Create Course (Instructor)", $createInstructorCourse['code'] === 201 && $instCourseId > 0, "Instructor failed to create course");

// Try to update Admin's course as Instructor (should fail 403)
$escalateUpdate = makeRequest('PUT', "/api/courses/{$newCourseId}", [
    'title' => 'Hacked by Instructor',
    'category_id' => $newCatId
], $instructorToken);
assertTest("Instructor Ownership Check (Update Other's Course)", $escalateUpdate['code'] === 403, "Allowed instructor to edit admin course: " . $escalateUpdate['code']);

// Try to delete Admin's course as Instructor (should fail 403)
$escalateDelete = makeRequest('DELETE', "/api/courses/{$newCourseId}", null, $instructorToken);
assertTest("Instructor Ownership Check (Delete Other's Course)", $escalateDelete['code'] === 403, "Allowed instructor to delete admin course: " . $escalateDelete['code']);

// Student CRUD blockage check (should fail 403 / 401 depending on middleware)
$studentCreate = makeRequest('POST', '/api/courses', [
    'category_id' => $newCatId,
    'title' => 'Student Course Try'
], $studentToken);
assertTest("Student Role Blocked from Course Creation", $studentCreate['code'] === 403, "Allowed student to create course: " . $studentCreate['code']);

// -----------------------------------------------------------------------------
// MODULE 3: COURSE MODULES CRUD & REORDERING
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 3. Course Modules Testing ---" . NC . "\n";

// A. Create Module (Admin on own course)
$createModule = makeRequest('POST', "/api/courses/{$newCourseId}/modules", [
    'title' => 'Module 1: Foundations',
    'description' => 'Foundational concepts.'
], $adminToken);
$modId1 = $createModule['body']['data']['id'] ?? 0;
assertTest("Create Module 1", $createModule['code'] === 201 && $modId1 > 0, "Failed creating module: " . $createModule['code']);

// B. Create Module 2
$createModule2 = makeRequest('POST', "/api/courses/{$newCourseId}/modules", [
    'title' => 'Module 2: Advanced Techniques',
    'description' => 'Advanced methods.'
], $adminToken);
$modId2 = $createModule2['body']['data']['id'] ?? 0;
assertTest("Create Module 2", $createModule2['code'] === 201 && $modId2 > 0);

// C. Verify initial sort order
assertTest("Initial sort order check", ($createModule['body']['data']['sort_order'] ?? 0) === 1 && ($createModule2['body']['data']['sort_order'] ?? 0) === 2, "Sort orders were not 1 and 2 respectively");

// D. Reorder modules
$reorder = makeRequest('POST', "/api/courses/{$newCourseId}/modules/reorder", [
    'module_ids' => [$modId2, $modId1]
], $adminToken);
assertTest("Reorder Modules", $reorder['code'] === 200, "Failed to reorder modules");

// Verify sort order persists
$fetchUpdatedCourse = makeRequest('GET', "/api/courses/{$newCourseId}", null, $adminToken);
$mods = $fetchUpdatedCourse['body']['data']['modules'] ?? [];
$reorderPassed = false;
if (count($mods) >= 2) {
    if ((int)$mods[0]['id'] === (int)$modId2 && (int)$mods[1]['id'] === (int)$modId1) {
        $reorderPassed = true;
    }
}
assertTest("Module Sort Order Persistence", $reorderPassed, "Modules did not persist in updated sorted order");

// E. Instructor Module Authorization Check
$escalateModule = makeRequest('POST', "/api/courses/{$newCourseId}/modules", [
    'title' => 'Instructor Hacked Module'
], $instructorToken);
assertTest("Instructor Access Check (Create Module in other course)", $escalateModule['code'] === 403, "Allowed instructor to create module in admin course");

// -----------------------------------------------------------------------------
// MODULE 4: LECTURES CRUD & REORDERING
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 4. Course Lectures Testing ---" . NC . "\n";

// A. Create Lecture 1 (Preview)
$createLec1 = makeRequest('POST', "/api/modules/{$modId1}/lectures", [
    'title' => 'Lecture 1.1: Introduction',
    'description' => 'Welcome message',
    'video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
    'duration' => '5m',
    'is_preview' => true,
    'video_type' => 'html5',
    'video_id' => 'intro-1'
], $adminToken);
$lecId1 = $createLec1['body']['data']['id'] ?? 0;
assertTest("Create Lecture 1 (Preview)", $createLec1['code'] === 201 && $lecId1 > 0, "Failed creating lecture: " . $createLec1['code']);

// B. Create Lecture 2 (Locked/Premium)
$createLec2 = makeRequest('POST', "/api/modules/{$modId1}/lectures", [
    'title' => 'Lecture 1.2: Deep Dive Core',
    'description' => 'Premium content details.',
    'video_url' => 'https://www.w3schools.com/html/movie.mp4',
    'duration' => '25m',
    'is_preview' => false,
    'video_type' => 'html5',
    'video_id' => 'premium-2'
], $adminToken);
$lecId2 = $createLec2['body']['data']['id'] ?? 0;
assertTest("Create Lecture 2 (Premium)", $createLec2['code'] === 201 && $lecId2 > 0);

// C. Student Preview Lecture Handling (Not Enrolled)
$fetchUnenrolled = makeRequest('GET', "/api/courses/{$newCourseId}", null, $studentToken);
$modsUnenrolled = $fetchUnenrolled['body']['data']['modules'] ?? [];
$lec1Visible = false;
$lec2Visible = false;
foreach ($modsUnenrolled as $m) {
    if ((int)$m['id'] === (int)$modId1) {
        foreach ($m['lectures'] as $l) {
            if ((int)$l['id'] === (int)$lecId1) {
                $lec1Visible = !empty($l['video_url']);
            }
            if ((int)$l['id'] === (int)$lecId2) {
                $lec2Visible = !empty($l['video_url']);
            }
        }
    }
}
assertTest("Unenrolled Student Preview Lecture: Video URL visible", $lec1Visible, "Preview lecture video URL was hidden");
assertTest("Unenrolled Student Premium Lecture: Video URL nullified", !$lec2Visible, "Premium lecture video URL was exposed to unenrolled student");

// D. Reorder lectures
$reorderLec = makeRequest('POST', "/api/modules/{$modId1}/lectures/reorder", [
    'lecture_ids' => [$lecId2, $lecId1]
], $adminToken);
assertTest("Reorder Lectures", $reorderLec['code'] === 200, "Failed to reorder lectures");

// Verify sort order persists
$fetchUpdatedCourse2 = makeRequest('GET', "/api/courses/{$newCourseId}", null, $adminToken);
$lecSortPassed = false;
foreach ($fetchUpdatedCourse2['body']['data']['modules'] ?? [] as $m) {
    if ((int)$m['id'] === (int)$modId1) {
        if (count($m['lectures']) >= 2 && (int)$m['lectures'][0]['id'] === (int)$lecId2 && (int)$m['lectures'][1]['id'] === (int)$lecId1) {
            $lecSortPassed = true;
        }
    }
}
assertTest("Lecture Sort Order Persistence", $lecSortPassed, "Lectures did not persist in updated sorted order");

// -----------------------------------------------------------------------------
// MODULE 5: ENROLLMENT SYSTEM TESTING
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 5. Enrollment System Testing ---" . NC . "\n";

// A. Enroll student in the newly created course
$enroll = makeRequest('POST', '/api/enrollments', [
    'course_id' => $newCourseId
], $studentToken);
$newEnrollmentId = $enroll['body']['data']['id'] ?? 0;
assertTest("Student Enrollment", $enroll['code'] === 201 && $newEnrollmentId > 0, "Enrollment failed: " . $enroll['code']);

// B. Duplicate Enrollment Prevention
$dupEnroll = makeRequest('POST', '/api/enrollments', [
    'course_id' => $newCourseId
], $studentToken);
assertTest("Duplicate Enrollment Prevention", $dupEnroll['code'] === 400, "Allowed duplicate enrollment: " . $dupEnroll['code']);

// C. Verify Premium Lecture URL is now visible to enrolled student
$fetchEnrolled = makeRequest('GET', "/api/courses/{$newCourseId}", null, $studentToken);
$modsEnrolled = $fetchEnrolled['body']['data']['modules'] ?? [];
$premiumVisibleEnrolled = false;
foreach ($modsEnrolled as $m) {
    if ((int)$m['id'] === (int)$modId1) {
        foreach ($m['lectures'] as $l) {
            if ((int)$l['id'] === (int)$lecId2) {
                $premiumVisibleEnrolled = !empty($l['video_url']);
            }
        }
    }
}
assertTest("Enrolled Student Premium Lecture: Video URL visible", $premiumVisibleEnrolled, "Premium lecture video URL was hidden after enrollment");

// D. Progress Updates
$updateProg = makeRequest('PUT', "/api/enrollments/{$newEnrollmentId}", [
    'progress' => 50
], $studentToken);
assertTest("Progress Update (50%)", $updateProg['code'] === 200 && (int)($updateProg['body']['data']['progress'] ?? 0) === 50, "Failed to update progress to 50%");

// E. Completion and Certificate Flags Automatic Triggering (progress = 100)
$updateProg100 = makeRequest('PUT', "/api/enrollments/{$newEnrollmentId}", [
    'progress' => 100
], $studentToken);
$completionOk = ($updateProg100['body']['data']['completion_status'] ?? '') === 'Completed';
$certOk = (int)($updateProg100['body']['data']['certificate_issued'] ?? 0) === 1;
assertTest("Progress Update (100%): Completion Status set to 'Completed'", $updateProg100['code'] === 200 && $completionOk, "Completion status not updated to 'Completed'");
assertTest("Progress Update (100%): Certificate Issued flag set to 1", $certOk, "Certificate flag not set to 1");

// F. Role Boundaries Verification
// Student trying to fetch/update someone else's enrollment record
// Let's create an enrollment for another user or verify using admin's view
// Try to fetch student's enrollment using Instructor token (owner of the category/course created by Admin - wait, course was created by Admin, so Instructor is NOT course creator)
$escalateGetEnroll = makeRequest('GET', "/api/enrollments/{$newEnrollmentId}", null, $instructorToken);
assertTest("Instructor Access Boundary (Retrieve enrollment of course not owned)", $escalateGetEnroll['code'] === 403, "Allowed instructor to retrieve enrollment of admin course: " . $escalateGetEnroll['code']);

// Try to retrieve enrollment using Admin token (should succeed)
$adminGetEnroll = makeRequest('GET', "/api/enrollments/{$newEnrollmentId}", null, $adminToken);
assertTest("Admin Access Boundary (Retrieve all enrollments)", $adminGetEnroll['code'] === 200, "Admin failed to retrieve enrollment: " . $adminGetEnroll['code']);

// Reset enrollment status using Admin token
$resetEnroll = makeRequest('PUT', "/api/enrollments/{$newEnrollmentId}", [
    'progress' => 10,
    'certificate_issued' => 0,
    'completion_status' => 'Active'
], $adminToken);
assertTest("Admin Reset Enrollment for Privilege Escalation Test", $resetEnroll['code'] === 200 && (int)($resetEnroll['body']['data']['certificate_issued'] ?? 0) === 0);

// Student trying to modify certificate_issued directly to 1 when progress < 100 (Privilege escalation)
$escalateCert = makeRequest('PUT', "/api/enrollments/{$newEnrollmentId}", [
    'progress' => 20,
    'certificate_issued' => 1,
    'completion_status' => 'Completed'
], $studentToken);

$newProg = (int)($escalateCert['body']['data']['progress'] ?? 0);
$newCert = (int)($escalateCert['body']['data']['certificate_issued'] ?? 0);
$newStatus = $escalateCert['body']['data']['completion_status'] ?? '';

assertTest("Student Privilege Escalation Check: Progress updated", $newProg === 20);
assertTest("Student Privilege Escalation Check: Certificate Issued flag ignored/remained 0", $newCert === 0, "Student successfully set certificate_issued to " . $newCert);
assertTest("Student Privilege Escalation Check: Completion Status ignored/remained Active", $newStatus === 'Active', "Student successfully set completion_status to " . $newStatus);

// Student trying to modify certificate_issued directly when not updating progress (Should return 403)
$escalateCertOnly = makeRequest('PUT', "/api/enrollments/{$newEnrollmentId}", [
    'certificate_issued' => 1
], $studentToken);
assertTest("Student Privilege Escalation Check: Certificate modification alone returns 403", $escalateCertOnly['code'] === 403);

// G. New API Endpoint Tests (GET /api/enrollments and DELETE /api/enrollments/{id})
// 1. GET /api/enrollments by Student
$studentEnrollList = makeRequest('GET', '/api/enrollments', null, $studentToken);
assertTest("GET /api/enrollments (Student): Successful list retrieval", $studentEnrollList['code'] === 200 && isset($studentEnrollList['body']['data']['enrollments']), "Failed to retrieve student enrollments list");

// 2. GET /api/enrollments by Student filtering other user_id (should return 403)
$studentEnrollListForbidden = makeRequest('GET', '/api/enrollments?user_id=' . $adminId, null, $studentToken);
assertTest("GET /api/enrollments (Student - filter other user): Returns 403 Forbidden", $studentEnrollListForbidden['code'] === 403, "Allowed student to filter list by other user_id: " . $studentEnrollListForbidden['code']);

// 3. GET /api/enrollments by Admin (unrestricted, pagination, filtering by user)
$adminEnrollList = makeRequest('GET', '/api/enrollments?user_id=' . $studentId . '&course_id=' . $newCourseId . '&limit=5&page=1', null, $adminToken);
$hasEnrollmentInList = false;
if (isset($adminEnrollList['body']['data']['enrollments'])) {
    foreach ($adminEnrollList['body']['data']['enrollments'] as $e) {
        if ((int)$e['id'] === (int)$newEnrollmentId) {
            $hasEnrollmentInList = true;
            break;
        }
    }
}
assertTest("GET /api/enrollments (Admin - user & course filters & pagination): Successful list retrieval", $adminEnrollList['code'] === 200 && $hasEnrollmentInList && isset($adminEnrollList['body']['data']['pagination']['total_items']), "Failed to retrieve filtered/paginated enrollments list for Admin");

// 4. DELETE /api/enrollments/{id} by Student (should return 403)
$studentDeleteEnroll = makeRequest('DELETE', "/api/enrollments/{$newEnrollmentId}", null, $studentToken);
assertTest("DELETE /api/enrollments (Student): Returns 403 Forbidden", $studentDeleteEnroll['code'] === 403, "Allowed student to delete enrollment: " . $studentDeleteEnroll['code']);

// 5. DELETE /api/enrollments/{id} by Instructor on course not owned (should return 403)
$instructorDeleteEnroll = makeRequest('DELETE', "/api/enrollments/{$newEnrollmentId}", null, $instructorToken);
assertTest("DELETE /api/enrollments (Instructor - other course): Returns 403 Forbidden", $instructorDeleteEnroll['code'] === 403, "Allowed instructor to delete enrollment in other course: " . $instructorDeleteEnroll['code']);

// 6. DELETE /api/enrollments/{id} by Admin (should succeed 200)
$adminDeleteEnroll = makeRequest('DELETE', "/api/enrollments/{$newEnrollmentId}", null, $adminToken);
assertTest("DELETE /api/enrollments (Admin): Successful deletion", $adminDeleteEnroll['code'] === 200, "Admin failed to delete enrollment: " . $adminDeleteEnroll['code']);

// 7. Verify deleted enrollment is not found
$deletedEnrollGet = makeRequest('GET', "/api/enrollments/{$newEnrollmentId}", null, $adminToken);
assertTest("DELETE /api/enrollments verification: Get returns 404", $deletedEnrollGet['code'] === 404, "Deleted enrollment still accessible: " . $deletedEnrollGet['code']);

// -----------------------------------------------------------------------------
// MODULE 6: API SECURITY AUDIT (IDOR / SQL INJECTION)
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 6. API Security Audit ---" . NC . "\n";

// A. Invalid JWT Verification
$invalidJwt = makeRequest('GET', '/api/courses', null, 'fake-token-xyz');
assertTest("Invalid JWT route rejection", $invalidJwt['code'] === 401, "Allowed access with invalid JWT: " . $invalidJwt['code']);

// B. Role Gating Rejection
$roleGate = makeRequest('POST', '/api/categories', [
    'name' => 'Student Category'
], $studentToken);
assertTest("Role Middleware Authorization Gating", $roleGate['code'] === 403, "Allowed student to hit admin-only route");

// C. IDOR validation (Admin course delete via Student token)
$idorDelete = makeRequest('DELETE', "/api/courses/{$newCourseId}", null, $studentToken);
assertTest("IDOR Course Delete Prevention", $idorDelete['code'] === 403, "Student was able to delete course");

// D. SQL Injection Protection
// Try passing SQL injections in search param
$sqlSearch = makeRequest('GET', "/api/courses?search=test'+OR+1=1--", null, $studentToken);
assertTest("SQL Injection Protection in Course Search", $sqlSearch['code'] === 200 && !str_contains($sqlSearch['raw'], "Database Error"), "SQL injection triggered database error or anomaly");

// E. Invalid ID Parameter Parsing Check
$invalidIdFetch = makeRequest('GET', "/api/courses/abc", null, $studentToken);
// The router index.php handles /api/courses/{id} by mapping {id} to $_GET['id'] or matching regex.
// In index.php, the regex is: preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $routePattern);
// So /api/courses/abc matches PUT or DELETE or GET /api/courses/{id}.
// In courses/get.php:
// $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
// If id <= 0 -> returns 400 Invalid course ID.
// Let's verify this!
assertTest("Invalid ID Parameter Parsing (Non-integer ID)", $invalidIdFetch['code'] === 400, "Failed to reject non-integer course ID with 400: " . $invalidIdFetch['code']);


// -----------------------------------------------------------------------------
// TEARDOWN & CLEANUP
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "Cleaning up test assets..." . NC . "\n";

// 1. Delete course lectures
makeRequest('DELETE', "/api/modules/{$modId1}/lectures/{$lecId1}", null, $adminToken);
makeRequest('DELETE', "/api/modules/{$modId1}/lectures/{$lecId2}", null, $adminToken);

// 2. Delete course modules
makeRequest('DELETE', "/api/courses/{$newCourseId}/modules/{$modId1}", null, $adminToken);
makeRequest('DELETE', "/api/courses/{$newCourseId}/modules/{$modId2}", null, $adminToken);

// 3. Delete courses
makeRequest('DELETE', "/api/courses/{$newCourseId}", null, $adminToken);
makeRequest('DELETE', "/api/courses/{$instCourseId}", null, $adminToken);

// 4. Delete categories
makeRequest('DELETE', "/api/categories/{$newCatId}", null, $adminToken);

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "AUDIT COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    echo GREEN . "All backend integration and security checks completed successfully!" . NC . "\n";
    exit(0);
} else {
    echo RED . "Some tests failed. Please check findings list." . NC . "\n";
    exit(1);
}
