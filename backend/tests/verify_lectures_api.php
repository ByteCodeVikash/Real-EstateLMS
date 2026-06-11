<?php
/**
 * REST API Verification Script for Lectures CRUD Endpoints
 * Run via: php backend/tests/verify_lectures_api.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "LECTURES CRUD REST API INTEGRATION TESTING" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// 1. Start built-in PHP web server on localhost:8091 in background
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

$testCategoryId = null;
$courseIdA = null;
$courseIdB = null;

$moduleIdA1 = null;
$moduleIdA2 = null;
$moduleIdB1 = null;

$lectureId1 = null;
$lectureId2 = null;
$lectureId3 = null;
$lectureIdB1 = null;
$lectureIdB2 = null;

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
    // 0. Setup and clean database entries
    $db->exec("DELETE FROM lectures WHERE title LIKE '%API Verification Lecture%'");
    $db->exec("DELETE FROM course_modules WHERE title LIKE '%API Verification Module%'");
    $db->exec("DELETE FROM courses WHERE title LIKE '%API Verification Course%'");
    $db->exec("DELETE FROM categories WHERE name = 'API Verification Category'");

    // Create Category
    $db->exec("INSERT INTO categories (name, slug, status) VALUES ('API Verification Category', 'api-verification-category', 'Active')");
    $testCategoryId = (int)$db->lastInsertId();

    // Create Course A & Course B (owned by user 1 - admin/instructor)
    $db->prepare("INSERT INTO courses (category_id, title, slug, description, status, created_by, mentor_name, thumbnail, duration) VALUES (?, 'API Verification Course A', 'api-verification-course-a', 'Course A desc', 'Published', 1, 'Mentor A', 'grad-blue', '4 Weeks')")->execute([$testCategoryId]);
    $courseIdA = (int)$db->lastInsertId();

    $db->prepare("INSERT INTO courses (category_id, title, slug, description, status, created_by, mentor_name, thumbnail, duration) VALUES (?, 'API Verification Course B', 'api-verification-course-b', 'Course B desc', 'Published', 1, 'Mentor B', 'grad-blue', '4 Weeks')")->execute([$testCategoryId]);
    $courseIdB = (int)$db->lastInsertId();

    // Enroll student (user 1) in Course A, but NOT in Course B
    $db->prepare("INSERT IGNORE INTO enrollments (user_id, course_id, progress, completion_status) VALUES (1, ?, 0, 'Active')")->execute([$courseIdA]);

    // Create Modules: Module A1 & A2 in Course A, Module B1 in Course B
    $db->prepare("INSERT INTO course_modules (course_id, title, description, sort_order, status) VALUES (?, 'API Verification Module A1', 'Desc A1', 1, 'Published')")->execute([$courseIdA]);
    $moduleIdA1 = (int)$db->lastInsertId();

    $db->prepare("INSERT INTO course_modules (course_id, title, description, sort_order, status) VALUES (?, 'API Verification Module A2', 'Desc A2', 2, 'Published')")->execute([$courseIdA]);
    $moduleIdA2 = (int)$db->lastInsertId();

    $db->prepare("INSERT INTO course_modules (course_id, title, description, sort_order, status) VALUES (?, 'API Verification Module B1', 'Desc B1', 1, 'Published')")->execute([$courseIdB]);
    $moduleIdB1 = (int)$db->lastInsertId();

    echo "Target Setup: Course A ({$courseIdA}), Course B ({$courseIdB})\n";
    echo "              Module A1 ({$moduleIdA1}), Module A2 ({$moduleIdA2}), Module B1 ({$moduleIdB1})\n\n";

    // =========================================================================
    // 1. Authentication and Authorization Boundaries
    // =========================================================================
    // A. Unauthenticated Blockage (401)
    $res = makeRequest('GET', "/api/lectures");
    assertAPI("GET /api/lectures unauthenticated returns 401", $res['code'] === 401, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures", ['title' => 'Unauth Lecture']);
    assertAPI("POST /api/modules/{id}/lectures unauthenticated returns 401", $res['code'] === 401, "Code: " . $res['code']);

    $res = makeRequest('PUT', "/api/modules/{$moduleIdA1}/lectures/1", ['title' => 'Unauth Lecture Update']);
    assertAPI("PUT /api/modules/{id}/lectures/{id} unauthenticated returns 401", $res['code'] === 401, "Code: " . $res['code']);

    $res = makeRequest('DELETE', "/api/modules/{$moduleIdA1}/lectures/1");
    assertAPI("DELETE /api/modules/{id}/lectures/{id} unauthenticated returns 401", $res['code'] === 401, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures/reorder", ['lecture_ids' => [1]]);
    assertAPI("POST /api/modules/{id}/lectures/reorder unauthenticated returns 401", $res['code'] === 401, "Code: " . $res['code']);

    // B. Student Role Forbidden Blockage (403)
    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures", ['title' => 'Student Lecture Attempt'], 'mock-student-token');
    assertAPI("POST /api/modules/{id}/lectures student role is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

    $res = makeRequest('PUT', "/api/modules/{$moduleIdA1}/lectures/1", ['title' => 'Student Update Attempt'], 'mock-student-token');
    assertAPI("PUT /api/modules/{id}/lectures/{id} student role is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

    $res = makeRequest('DELETE', "/api/modules/{$moduleIdA1}/lectures/1", null, 'mock-student-token');
    assertAPI("DELETE /api/modules/{id}/lectures/{id} student role is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures/reorder", ['lecture_ids' => [1]], 'mock-student-token');
    assertAPI("POST /api/modules/{id}/lectures/reorder student role is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

    // C. Non-owner Instructor Forbidden Blockage (403)
    // Make course owned by ID 2 (someone else)
    $db->prepare("UPDATE courses SET created_by = 2 WHERE id = ?")->execute([$courseIdA]);

    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures", ['title' => 'Instructor Lecture Attempt'], 'mock-instructor-token');
    assertAPI("POST /api/modules/{id}/lectures non-owner instructor is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures/reorder", ['lecture_ids' => [1]], 'mock-instructor-token');
    assertAPI("POST /api/modules/{id}/lectures/reorder non-owner instructor is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

    // Restore course owner to ID 1
    $db->prepare("UPDATE courses SET created_by = 1 WHERE id = ?")->execute([$courseIdA]);


    // =========================================================================
    // 2. Lecture Creation Validation & Sort Order Defaults
    // =========================================================================
    // Create Lecture 1 (Draft, Preview)
    $payload1 = [
        'title' => 'API Verification Lecture One',
        'description' => 'Description of first test lecture.',
        'duration' => '12m',
        'video_url' => 'https://example.com/lecture1-video.mp4',
        'is_preview' => true,
        'video_type' => 'html5',
        'video_id' => 'l1-vid-id',
        'status' => 'Draft'
    ];
    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures", $payload1, 'mock-admin-token');
    $success1 = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST /api/modules/{id}/lectures admin creates lecture 1 successfully (201)", $success1, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    if ($success1) {
        $lectureId1 = (int)$res['body']['data']['id'];
        assertAPI("Created Lecture 1 title matches", $res['body']['data']['title'] === $payload1['title']);
        assertAPI("Created Lecture 1 default sort_order is 1", $res['body']['data']['sort_order'] === 1);
        assertAPI("Created Lecture 1 status is 'Draft'", $res['body']['data']['status'] === 'Draft');
        assertAPI("Created Lecture 1 is_preview is true", $res['body']['data']['is_preview'] === true);
    }

    // Create Lecture 2 (Draft, Premium)
    $payload2 = [
        'title' => 'API Verification Lecture Two',
        'description' => 'Description of second test lecture.',
        'duration' => '24m',
        'video_url' => 'https://example.com/lecture2-video.mp4',
        'is_preview' => false,
        'video_type' => 'html5',
        'video_id' => 'l2-vid-id',
        'status' => 'Draft'
    ];
    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures", $payload2, 'mock-admin-token');
    $success2 = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST /api/modules/{id}/lectures admin creates lecture 2 successfully (201)", $success2, "Code: " . $res['code']);
    if ($success2) {
        $lectureId2 = (int)$res['body']['data']['id'];
        assertAPI("Created Lecture 2 sort_order increments to 2", $res['body']['data']['sort_order'] === 2);
    }

    // Now that lectures exist, test that non-owner instructor is blocked from updating or deleting them (403)
    if ($lectureId1) {
        // Make course owned by ID 2 (someone else)
        $db->prepare("UPDATE courses SET created_by = 2 WHERE id = ?")->execute([$courseIdA]);

        $res = makeRequest('PUT', "/api/modules/{$moduleIdA1}/lectures/{$lectureId1}", ['title' => 'Instructor Update Attempt'], 'mock-instructor-token');
        assertAPI("PUT /api/modules/{id}/lectures/{id} non-owner instructor is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

        $res = makeRequest('DELETE', "/api/modules/{$moduleIdA1}/lectures/{$lectureId1}", null, 'mock-instructor-token');
        assertAPI("DELETE /api/modules/{id}/lectures/{id} non-owner instructor is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

        // Restore course owner to ID 1
        $db->prepare("UPDATE courses SET created_by = 1 WHERE id = ?")->execute([$courseIdA]);
    }


    // =========================================================================
    // 3. Validation Failures
    // =========================================================================
    // A. Empty Title Validation
    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures", ['title' => '', 'status' => 'Draft'], 'mock-admin-token');
    assertAPI("POST lecture with empty title returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // B. Invalid Status Validation
    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures", ['title' => 'Valid Title', 'status' => 'NotAStatus'], 'mock-admin-token');
    assertAPI("POST lecture with invalid status returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // C. Duplicate Title in Same Module
    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures", ['title' => 'API Verification Lecture One', 'status' => 'Draft'], 'mock-admin-token');
    assertAPI("POST duplicate title in same module returns 409 Conflict", $res['code'] === 409, "Code: " . $res['code']);

    // D. Reorder empty payload validation
    $res = makeRequest('POST', "/api/modules/{$moduleIdA1}/lectures/reorder", [], 'mock-admin-token');
    assertAPI("POST reorder with empty payload returns 400", $res['code'] === 400, "Code: " . $res['code']);


    // =========================================================================
    // 4. Lecture Details, Visibility, and Redaction boundaries
    // =========================================================================
    // Admin fetches draft details (succeeds)
    if ($lectureId1) {
        $res = makeRequest('GET', "/api/lectures/{$lectureId1}", null, 'mock-admin-token');
        assertAPI("GET /api/lectures/{id} admin fetches draft lecture details successfully (200)", $res['code'] === 200, "Code: " . $res['code']);

        // Student fetches draft details (denied 403)
        $res = makeRequest('GET', "/api/lectures/{$lectureId1}", null, 'mock-student-token');
        assertAPI("GET /api/lectures/{id} student forbidden from draft lecture (403)", $res['code'] === 403, "Code: " . $res['code']);

        // Publish Lecture 1
        $res = makeRequest('PUT', "/api/lectures/{$lectureId1}", ['status' => 'Published'], 'mock-admin-token');
        assertAPI("PUT /api/lectures/{id} publish Lecture 1 succeeds (200)", $res['code'] === 200, "Code: " . $res['code']);
    }

    if ($lectureId2) {
        // Publish Lecture 2
        $res = makeRequest('PUT', "/api/lectures/{$lectureId2}", ['status' => 'Published'], 'mock-admin-token');
        assertAPI("PUT /api/lectures/{id} publish Lecture 2 succeeds (200)", $res['code'] === 200, "Code: " . $res['code']);
    }

    // Now test redaction with Course B (where student user 1 is NOT enrolled)
    // Admin creates Lecture B1 (Published, is_preview = true) in Course B
    $res = makeRequest('POST', "/api/modules/{$moduleIdB1}/lectures", [
        'title' => 'API Verification Lecture B1',
        'is_preview' => true,
        'video_url' => 'https://example.com/preview-b1.mp4',
        'video_id' => 'vid-b1',
        'status' => 'Published'
    ], 'mock-admin-token');
    if ($res['code'] === 201 && isset($res['body']['data']['id'])) {
        $lectureIdB1 = (int)$res['body']['data']['id'];
    }

    // Admin creates Lecture B2 (Published, is_preview = false) in Course B
    $res = makeRequest('POST', "/api/modules/{$moduleIdB1}/lectures", [
        'title' => 'API Verification Lecture B2',
        'is_preview' => false,
        'video_url' => 'https://example.com/premium-b2.mp4',
        'video_id' => 'vid-b2',
        'status' => 'Published'
    ], 'mock-admin-token');
    if ($res['code'] === 201 && isset($res['body']['data']['id'])) {
        $lectureIdB2 = (int)$res['body']['data']['id'];
    }

    // Verify Visibility Redactions for Student
    // Enrolled Student fetches Lecture 1 (Preview) in Course A
    if ($lectureId1) {
        $res = makeRequest('GET', "/api/lectures/{$lectureId1}", null, 'mock-student-token');
        assertAPI("Enrolled Student GET preview lecture: video fields visible", 
            $res['code'] === 200 && !empty($res['body']['data']['video_url']) && !empty($res['body']['data']['video_id']),
            "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    }

    // Enrolled Student fetches Lecture 2 (Premium/is_preview=false) in Course A
    if ($lectureId2) {
        $res = makeRequest('GET', "/api/lectures/{$lectureId2}", null, 'mock-student-token');
        assertAPI("Enrolled Student GET premium lecture: video fields visible", 
            $res['code'] === 200 && !empty($res['body']['data']['video_url']) && !empty($res['body']['data']['video_id']),
            "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    }

    // Unenrolled Student fetches Lecture B1 (Preview) in Course B
    if ($lectureIdB1) {
        $res = makeRequest('GET', "/api/lectures/{$lectureIdB1}", null, 'mock-student-token');
        assertAPI("Unenrolled Student GET preview lecture: video fields visible", 
            $res['code'] === 200 && !empty($res['body']['data']['video_url']) && !empty($res['body']['data']['video_id']),
            "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    }

    // Unenrolled Student fetches Lecture B2 (Premium/is_preview=false) in Course B (Redaction Check!)
    if ($lectureIdB2) {
        $res = makeRequest('GET', "/api/lectures/{$lectureIdB2}", null, 'mock-student-token');
        assertAPI("Unenrolled Student GET premium lecture: video fields redacted (null)", 
            $res['code'] === 200 && is_null($res['body']['data']['video_url']) && is_null($res['body']['data']['video_id']),
            "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    }


    // =========================================================================
    // 5. Lecture List, Module Filters, Status Filters, and Sorting
    // =========================================================================
    // A. Fetch List for Admin (includes all)
    $res = makeRequest('GET', "/api/lectures", null, 'mock-admin-token');
    assertAPI("GET /api/lectures admin lists all lectures successfully (200)", $res['code'] === 200 && isset($res['body']['data']['pagination']), "Code: " . $res['code']);

    // B. Fetch List with Module Filter
    $res = makeRequest('GET', "/api/lectures?module_id={$moduleIdA1}", null, 'mock-admin-token');
    $list = $res['body']['data']['lectures'] ?? [];
    $filteredCorrectly = true;
    foreach ($list as $lec) {
        if ((int)$lec['module_id'] !== $moduleIdA1) {
            $filteredCorrectly = false;
        }
    }
    assertAPI("GET list with module_id filter returns module matches only", $res['code'] === 200 && count($list) >= 2 && $filteredCorrectly, "Code: " . $res['code'] . " Count: " . count($list));

    // C. Fetch List for Student (returns Published only; let's draft one and see)
    // Draft Lecture B2
    if ($lectureIdB2) {
        makeRequest('PUT', "/api/lectures/{$lectureIdB2}", ['status' => 'Draft'], 'mock-admin-token');
    }
    $res = makeRequest('GET', "/api/lectures", null, 'mock-student-token');
    $studentList = $res['body']['data']['lectures'] ?? [];
    $hasDraft = false;
    foreach ($studentList as $lec) {
        if ($lec['status'] !== 'Published') {
            $hasDraft = true;
        }
    }
    assertAPI("GET list for student returns Published status lectures only", $res['code'] === 200 && !$hasDraft, "Code: " . $res['code'] . " List: " . json_encode($studentList));

    // Publish B2 back
    if ($lectureIdB2) {
        makeRequest('PUT', "/api/lectures/{$lectureIdB2}", ['status' => 'Published'], 'mock-admin-token');
    }

    // D. Pagination Checks
    $res = makeRequest('GET', "/api/lectures?limit=1&page=2", null, 'mock-admin-token');
    $pagination = $res['body']['data']['pagination'] ?? [];
    $paginatedLectures = $res['body']['data']['lectures'] ?? [];
    assertAPI("GET list with pagination limits response count and reflects in meta", 
        $res['code'] === 200 && count($paginatedLectures) <= 1 && ($pagination['limit'] ?? 0) === 1 && ($pagination['current_page'] ?? 0) === 2,
        "Code: " . $res['code'] . " Pagination: " . json_encode($pagination));

    // E. Status Filter Checks
    $res = makeRequest('GET', "/api/lectures?status=Published", null, 'mock-admin-token');
    $publishedList = $res['body']['data']['lectures'] ?? [];
    $allPublished = true;
    foreach ($publishedList as $lec) {
        if ($lec['status'] !== 'Published') {
            $allPublished = false;
        }
    }
    assertAPI("GET list with status filter returns status matches only", $res['code'] === 200 && count($publishedList) > 0 && $allPublished, "Code: " . $res['code']);

    // F. Instructor List Course Ownership (Exclusion)
    // Make Course A owned by ID 2 (someone else)
    $db->prepare("UPDATE courses SET created_by = 2 WHERE id = ?")->execute([$courseIdA]);

    $res = makeRequest('GET', "/api/lectures", null, 'mock-instructor-token');
    $instructorList = $res['body']['data']['lectures'] ?? [];
    $hasCourseALectures = false;
    foreach ($instructorList as $lec) {
        if ((int)$lec['course_id'] === $courseIdA) {
            $hasCourseALectures = true;
        }
    }
    assertAPI("GET list for instructor excludes lectures from non-owned courses", $res['code'] === 200 && !$hasCourseALectures, "Code: " . $res['code']);

    // Restore course owner to ID 1
    $db->prepare("UPDATE courses SET created_by = 1 WHERE id = ?")->execute([$courseIdA]);

    // G. Student List Video Redaction
    $res = makeRequest('GET', "/api/lectures", null, 'mock-student-token');
    $studentListAll = $res['body']['data']['lectures'] ?? [];
    $redactionSuccess = false;
    $enrolledSuccess = false;
    foreach ($studentListAll as $lec) {
        if ($lectureIdB2 && (int)$lec['id'] === $lectureIdB2) {
            // Unenrolled premium lecture should be redacted
            if (is_null($lec['video_url']) && is_null($lec['video_id'])) {
                $redactionSuccess = true;
            }
        }
        if ($lectureId1 && (int)$lec['id'] === $lectureId1) {
            // Enrolled preview lecture should be visible
            if (!empty($lec['video_url']) && !empty($lec['video_id'])) {
                $enrolledSuccess = true;
            }
        }
    }
    assertAPI("GET list for student redacts unenrolled premium lectures but shows enrolled/preview lectures", 
        $res['code'] === 200 && $redactionSuccess && $enrolledSuccess,
        "Code: " . $res['code'] . " Redaction: " . ($redactionSuccess ? 'yes' : 'no') . " Enrolled: " . ($enrolledSuccess ? 'yes' : 'no'));

    // H. Validation of Listing Parameters
    $res = makeRequest('GET', "/api/lectures?status=InvalidStatus", null, 'mock-admin-token');
    assertAPI("GET list with invalid status filter returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('GET', "/api/lectures?sort=invalid_column", null, 'mock-admin-token');
    assertAPI("GET list with invalid sort column returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('GET', "/api/lectures?order=invalid_dir", null, 'mock-admin-token');
    assertAPI("GET list with invalid sort order returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // I. Sorting Checks
    // Sort by title asc
    $res = makeRequest('GET', "/api/lectures?module_id={$moduleIdA1}&sort=title&order=asc", null, 'mock-admin-token');
    $sortedList = $res['body']['data']['lectures'] ?? [];
    $isSortedAsc = (count($sortedList) >= 2 && strcmp($sortedList[0]['title'], $sortedList[1]['title']) <= 0);
    assertAPI("GET list sorted by title asc returns correct order", $res['code'] === 200 && $isSortedAsc, "Code: " . $res['code'] . " Titles: " . implode(', ', array_column($sortedList, 'title')));

    // Sort by title desc
    $res = makeRequest('GET', "/api/lectures?module_id={$moduleIdA1}&sort=title&order=desc", null, 'mock-admin-token');
    $sortedListDesc = $res['body']['data']['lectures'] ?? [];
    $isSortedDesc = (count($sortedListDesc) >= 2 && strcmp($sortedListDesc[0]['title'], $sortedListDesc[1]['title']) >= 0);
    assertAPI("GET list sorted by title desc returns correct order", $res['code'] === 200 && $isSortedDesc, "Code: " . $res['code'] . " Titles: " . implode(', ', array_column($sortedListDesc, 'title')));


    // =========================================================================
    // 6. Lecture Update - Module Transfer and Re-indexing
    // =========================================================================
    // Transfer Lecture 1 (module A1, sort_order 1) to Module A2
    // We expect Lecture 1 to get appended to Module A2 (sort_order 1)
    // We expect remaining Lecture 2 in Module A1 to be re-indexed from sort_order 2 down to 1
    if ($lectureId1) {
        $res = makeRequest('PUT', "/api/lectures/{$lectureId1}", ['module_id' => $moduleIdA2], 'mock-admin-token');
        assertAPI("PUT lecture module transfer succeeds (200)", $res['code'] === 200 && (int)$res['body']['data']['module_id'] === $moduleIdA2, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

        // Verify remaining Lecture 2 in Module A1 shifted down to sort_order 1
        if ($lectureId2) {
            $res = makeRequest('GET', "/api/lectures/{$lectureId2}", null, 'mock-admin-token');
            assertAPI("Remaining lecture in original module re-indexed to sort_order 1", $res['code'] === 200 && $res['body']['data']['sort_order'] === 1, "Code: " . $res['code'] . " Sort order: " . ($res['body']['data']['sort_order'] ?? ''));
        }
    }


    // =========================================================================
    // 7. Lecture Reordering Endpoint
    // =========================================================================
    // Now Module A2 has Lecture 1 (sort_order 1)
    // Let's create another lecture in Module A2 (Lecture 3, will default to sort_order 2)
    $res = makeRequest('POST', "/api/modules/{$moduleIdA2}/lectures", [
        'title' => 'API Verification Lecture Three',
        'status' => 'Published'
    ], 'mock-admin-token');
    if ($res['code'] === 201 && isset($res['body']['data']['id'])) {
        $lectureId3 = (int)$res['body']['data']['id'];
    }

    if ($lectureId1 && $lectureId3) {
        // Reorder Module A2: Lecture 3 first, then Lecture 1
        $res = makeRequest('POST', "/api/modules/{$moduleIdA2}/lectures/reorder", [
            'lecture_ids' => [$lectureId3, $lectureId1]
        ], 'mock-admin-token');
        assertAPI("POST reorder lectures succeeds (200)", $res['code'] === 200, "Code: " . $res['code']);

        // Verify reorder persists in list GET
        $res = makeRequest('GET', "/api/lectures?module_id={$moduleIdA2}&sort=sort_order&order=asc", null, 'mock-admin-token');
        $moduleA2List = $res['body']['data']['lectures'] ?? [];
        $reorderedCorrectly = (count($moduleA2List) === 2 && (int)$moduleA2List[0]['id'] === $lectureId3 && (int)$moduleA2List[1]['id'] === $lectureId1);
        assertAPI("List of module A2 lectures returns updated sorted order (Lecture 3 first, Lecture 1 second)", 
            $res['code'] === 200 && $reorderedCorrectly, 
            "Code: " . $res['code'] . " List: " . json_encode($moduleA2List));
    }


    // =========================================================================
    // 8. Lecture Deletion & Re-indexing
    // =========================================================================
    // Delete Lecture 3 (which was reordered to sort_order 1)
    // Remaining Lecture 1 (which was sort_order 2) should shift down to sort_order 1
    if ($lectureId3) {
        $res = makeRequest('DELETE', "/api/lectures/{$lectureId3}", null, 'mock-admin-token');
        assertAPI("DELETE /api/lectures/{id} deletes Lecture 3 successfully (200)", $res['code'] === 200, "Code: " . $res['code']);

        // Verify details return 404
        $res = makeRequest('GET', "/api/lectures/{$lectureId3}", null, 'mock-admin-token');
        assertAPI("GET deleted lecture returns 404", $res['code'] === 404, "Code: " . $res['code']);

        // Verify remaining Lecture 1 shifted down to sort_order 1
        if ($lectureId1) {
            $res = makeRequest('GET', "/api/lectures/{$lectureId1}", null, 'mock-admin-token');
            assertAPI("Remaining lecture in Module A2 shifted to sort_order 1 after deletion", 
                $res['code'] === 200 && $res['body']['data']['sort_order'] === 1,
                "Code: " . $res['code'] . " Sort order: " . ($res['body']['data']['sort_order'] ?? ''));
        }
    }


    // =========================================================================
    // 9. Invalid ID Handling
    // =========================================================================
    // A. Non-integer ID (Router maps URL parameter, but controller validates)
    $res = makeRequest('GET', "/api/lectures/abc", null, 'mock-admin-token');
    assertAPI("GET lecture with non-integer ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('PUT', "/api/lectures/abc", ['title' => 'Updated'], 'mock-admin-token');
    assertAPI("PUT lecture with non-integer ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('DELETE', "/api/lectures/abc", null, 'mock-admin-token');
    assertAPI("DELETE lecture with non-integer ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/modules/abc/lectures", ['title' => 'Lecture'], 'mock-admin-token');
    assertAPI("POST lecture with non-integer module ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/modules/abc/lectures/reorder", ['lecture_ids' => [1]], 'mock-admin-token');
    assertAPI("POST reorder with non-integer module ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // B. Zero or Negative ID
    $res = makeRequest('GET', "/api/lectures/0", null, 'mock-admin-token');
    assertAPI("GET lecture with zero ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('GET', "/api/lectures/-5", null, 'mock-admin-token');
    assertAPI("GET lecture with negative ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // C. Non-existent ID (404)
    $res = makeRequest('GET', "/api/lectures/999999", null, 'mock-admin-token');
    assertAPI("GET lecture with non-existent ID returns 404", $res['code'] === 404, "Code: " . $res['code']);

    $res = makeRequest('PUT', "/api/lectures/999999", ['title' => 'No Exist'], 'mock-admin-token');
    assertAPI("PUT lecture with non-existent ID returns 404", $res['code'] === 404, "Code: " . $res['code']);

    $res = makeRequest('DELETE', "/api/lectures/999999", null, 'mock-admin-token');
    assertAPI("DELETE lecture with non-existent ID returns 404", $res['code'] === 404, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/modules/999999/lectures", ['title' => 'No Module'], 'mock-admin-token');
    assertAPI("POST lecture with non-existent module ID returns 404", $res['code'] === 404, "Code: " . $res['code']);

} finally {
    // Teardown database entries
    if ($testCategoryId) {
        $db->exec("DELETE FROM lectures WHERE title LIKE '%API Verification Lecture%'");
        $db->exec("DELETE FROM course_modules WHERE course_id IN ({$courseIdA}, {$courseIdB})");
        $db->exec("DELETE FROM enrollments WHERE course_id = {$courseIdA}");
        $db->exec("DELETE FROM courses WHERE category_id = {$testCategoryId}");
        $db->exec("DELETE FROM categories WHERE id = {$testCategoryId}");
    }

    // Shut down PHP built-in web server
    echo "\n" . YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "LECTURES API VERIFICATION COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    echo GREEN . "All Lectures CRUD REST API endpoints fully conform to validation, authorization, and output requirements!" . NC . "\n";
    exit(0);
} else {
    echo RED . "Some Lectures REST API verification tests failed." . NC . "\n";
    exit(1);
}
