<?php
/**
 * REST API Verification Script for Course Modules CRUD Endpoints
 * Run via: php backend/tests/verify_modules_api.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "COURSE MODULES CRUD REST API INTEGRATION TESTING" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// 1. Start built-in PHP web server on localhost:8088 in background
echo YELLOW . "Starting PHP built-in web server on 127.0.0.1:8088..." . NC . "\n";
$serverProcess = proc_open("exec php -S 127.0.0.1:8088 backend/index.php", [
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
    $url = "http://127.0.0.1:8088" . $path;
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

$moduleId1 = null;
$moduleId2 = null;
$moduleId3 = null;

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
    // 0. Ensure we have at least one valid Category to reference
    $stmtCat = $db->query("SELECT id FROM categories LIMIT 1");
    $testCategoryId = $stmtCat->fetchColumn();
    if (!$testCategoryId) {
        $db->exec("INSERT INTO categories (name, slug, status) VALUES ('Test Modules Verify Cat', 'test-modules-verify-cat', 'Active')");
        $testCategoryId = (int)$db->lastInsertId();
    } else {
        $testCategoryId = (int)$testCategoryId;
    }

    // Clean up any old test courses & modules
    $db->exec("DELETE FROM course_modules WHERE title LIKE '%API Verification Module%'");
    $db->exec("DELETE FROM courses WHERE title LIKE '%API Verification Modules Course%'");

    // Insert Course A (owned by admin - user 1)
    $db->prepare("INSERT INTO courses (category_id, title, slug, description, status, created_by, mentor_name, thumbnail, duration) VALUES (?, 'API Verification Modules Course A', 'api-verification-modules-course-a', 'Course description', 'Published', 1, 'Test Mentor', 'grad-blue', '6 Weeks')")
       ->execute([$testCategoryId]);
    $courseIdA = (int)$db->lastInsertId();

    // Insert Course B (owned by admin - user 1)
    $db->prepare("INSERT INTO courses (category_id, title, slug, description, status, created_by, mentor_name, thumbnail, duration) VALUES (?, 'API Verification Modules Course B', 'api-verification-modules-course-b', 'Course description', 'Published', 1, 'Test Mentor', 'grad-blue', '6 Weeks')")
       ->execute([$testCategoryId]);
    $courseIdB = (int)$db->lastInsertId();

    // Ensure student user is enrolled in Course A so they can view Published modules (if check requires enrollment)
    $db->prepare("INSERT IGNORE INTO enrollments (user_id, course_id, progress, completion_status) VALUES (1, ?, 0, 'Active')")->execute([$courseIdA]);

    echo "Targeting Course A ID: {$courseIdA}, Course B ID: {$courseIdB}\n\n";

    // 1. Unauthenticated access blockage (401)
    $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules");
    assertAPI("GET /api/courses/{id}/modules unauthenticated is blocked", $res['code'] === 401, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", ['title' => 'Unauth Module']);
    assertAPI("POST /api/courses/{id}/modules unauthenticated is blocked", $res['code'] === 401, "Code: " . $res['code']);


    // 2. Student role permission blockage (403)
    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", ['title' => 'Student Attempt Module'], 'mock-student-token');
    assertAPI("POST /api/courses/{id}/modules student role is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

    $res = makeRequest('PUT', "/api/courses/{$courseIdA}/modules/1", ['title' => 'Student Attempt Update'], 'mock-student-token');
    assertAPI("PUT /api/courses/{id}/modules/{mod_id} student update is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

    $res = makeRequest('DELETE', "/api/courses/{$courseIdA}/modules/1", null, 'mock-student-token');
    assertAPI("DELETE /api/courses/{id}/modules/{mod_id} student delete is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules/reorder", ['module_ids' => [1, 2]], 'mock-student-token');
    assertAPI("POST /api/courses/{id}/modules/reorder student reorder is Forbidden", $res['code'] === 403, "Code: " . $res['code']);


    // 3. Create Module (201) and field checks
    $payload1 = [
        'title' => 'API Verification Module One',
        'description' => 'Description of first module',
        'status' => 'Draft',
        'lectures' => []
    ];
    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", $payload1, 'mock-admin-token');
    $success1 = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST /api/courses/{id}/modules admin creates module 1 successfully", $success1, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    if ($success1) {
        $moduleId1 = (int)$res['body']['data']['id'];
        assertAPI("Created Module 1 has correct title", $res['body']['data']['title'] === 'API Verification Module One');
        assertAPI("Created Module 1 has correct sort_order (1)", $res['body']['data']['sort_order'] === 1);
        assertAPI("Created Module 1 has correct status (Draft)", $res['body']['data']['status'] === 'Draft');
    }


    // 4. Validation Failures (empty title -> 400, invalid status -> 400, duplicate title -> 409)
    $payloadEmptyTitle = [
        'title' => '',
        'status' => 'Draft'
    ];
    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", $payloadEmptyTitle, 'mock-admin-token');
    assertAPI("POST /api/courses/{id}/modules empty title validation returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $payloadInvalidStatus = [
        'title' => 'Invalid Status Module',
        'status' => 'NotAStatus'
    ];
    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", $payloadInvalidStatus, 'mock-admin-token');
    assertAPI("POST /api/courses/{id}/modules invalid status validation returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // Duplicate title check
    $payloadDuplicateTitle = [
        'title' => 'API Verification Module One',
        'status' => 'Draft'
    ];
    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", $payloadDuplicateTitle, 'mock-admin-token');
    assertAPI("POST /api/courses/{id}/modules duplicate title validation returns 409 Conflict", $res['code'] === 409, "Code: " . $res['code']);


    // 5. Get Module Details (GET)
    if ($moduleId1) {
        // Try fetching Draft module as Student (should fail 403)
        $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules/{$moduleId1}", null, 'mock-student-token');
        assertAPI("GET /api/courses/{id}/modules/{mod_id} student blocked from Draft module", $res['code'] === 403, "Code: " . $res['code']);

        // Fetch as Admin (should succeed)
        $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules/{$moduleId1}", null, 'mock-admin-token');
        assertAPI("GET /api/courses/{id}/modules/{mod_id} retrieves detail successfully for admin", $res['code'] === 200 && $res['body']['data']['title'] === 'API Verification Module One', "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    }


    // 6. Update Module (PUT)
    if ($moduleId1) {
        $updatePayload = [
            'title' => 'API Verification Module One Updated',
            'description' => 'Updated description',
            'status' => 'Published'
        ];
        $res = makeRequest('PUT', "/api/courses/{$courseIdA}/modules/{$moduleId1}", $updatePayload, 'mock-admin-token');
        assertAPI("PUT /api/courses/{id}/modules/{mod_id} updates module successfully", $res['code'] === 200 && $res['body']['data']['title'] === 'API Verification Module One Updated' && $res['body']['data']['status'] === 'Published', "Code: " . $res['code']);

        // Verify Student can now fetch it since it's Published
        $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules/{$moduleId1}", null, 'mock-student-token');
        assertAPI("GET /api/courses/{id}/modules/{mod_id} student can now view Published module", $res['code'] === 200 && $res['body']['data']['title'] === 'API Verification Module One Updated', "Code: " . $res['code']);

        // PUT empty title validation
        $res = makeRequest('PUT', "/api/courses/{$courseIdA}/modules/{$moduleId1}", ['title' => ''], 'mock-admin-token');
        assertAPI("PUT /api/courses/{id}/modules/{mod_id} empty title validation returns 400", $res['code'] === 400, "Code: " . $res['code']);

        // PUT invalid status validation
        $res = makeRequest('PUT', "/api/courses/{$courseIdA}/modules/{$moduleId1}", ['status' => 'Unknown'], 'mock-admin-token');
        assertAPI("PUT /api/courses/{id}/modules/{mod_id} invalid status validation returns 400", $res['code'] === 400, "Code: " . $res['code']);
    }


    // 7. Sort Order & Reorder Validation
    // Create second module in Course A
    $payload2 = [
        'title' => 'API Verification Module Two',
        'status' => 'Published'
    ];
    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", $payload2, 'mock-admin-token');
    $success2 = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST /api/courses/{id}/modules admin creates module 2 successfully", $success2, "Code: " . $res['code']);
    if ($success2) {
        $moduleId2 = (int)$res['body']['data']['id'];
        assertAPI("Created Module 2 has correct sort_order (2)", $res['body']['data']['sort_order'] === 2);
    }

    if ($moduleId1 && $moduleId2) {
        // Reorder modules: make Module 2 first, Module 1 second
        $reorderPayload = [
            'module_ids' => [$moduleId2, $moduleId1]
        ];
        $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules/reorder", $reorderPayload, 'mock-admin-token');
        assertAPI("POST /api/courses/{id}/modules/reorder admin reorders modules successfully", $res['code'] === 200, "Code: " . $res['code']);

        // Verify sorted order persists and matches GET list
        $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules", null, 'mock-admin-token');
        $modulesList = $res['body']['data']['modules'] ?? [];
        $correctlySorted = (count($modulesList) >= 2 && (int)$modulesList[0]['id'] === $moduleId2 && (int)$modulesList[1]['id'] === $moduleId1);
        assertAPI("List of modules returns updated sorted order (Module 2 first, Module 1 second)", $res['code'] === 200 && $correctlySorted, "Code: " . $res['code'] . " List: " . json_encode($modulesList));
    }


    // 8. Course Filter
    // Create Module 3 in Course B
    $payload3 = [
        'title' => 'API Verification Module Three',
        'status' => 'Published'
    ];
    $res = makeRequest('POST', "/api/courses/{$courseIdB}/modules", $payload3, 'mock-admin-token');
    $success3 = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST /api/courses/{id}/modules admin creates module 3 in Course B successfully", $success3, "Code: " . $res['code']);
    if ($success3) {
        $moduleId3 = (int)$res['body']['data']['id'];
    }

    if ($courseIdA && $courseIdB && $moduleId3) {
        // Fetch list for Course A: should contain Module 1 and 2, but NOT Module 3
        $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules", null, 'mock-admin-token');
        $modulesListA = $res['body']['data']['modules'] ?? [];
        $hasModule3InA = false;
        foreach ($modulesListA as $m) {
            if ((int)$m['id'] === $moduleId3) {
                $hasModule3InA = true;
            }
        }
        assertAPI("GET list for Course A does not return Course B's module", $res['code'] === 200 && !$hasModule3InA, "Code: " . $res['code'] . " List: " . json_encode($modulesListA));

        // Fetch details of Module 3 using Course A's ID: should return 404 (mismatch)
        $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules/{$moduleId3}", null, 'mock-admin-token');
        assertAPI("GET module detail with course mismatch returns 404", $res['code'] === 404, "Code: " . $res['code']);
    }


    // 9. Invalid ID Handling
    // A. Non-integer ID (Router matches URL route containing string IDs, but controller rejects)
    $res = makeRequest('GET', "/api/courses/abc/modules/{$moduleId1}", null, 'mock-admin-token');
    assertAPI("GET modules with non-integer course ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules/abc", null, 'mock-admin-token');
    assertAPI("GET modules with non-integer module ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // B. Negative/Zero ID
    $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules/0", null, 'mock-admin-token');
    assertAPI("GET modules with zero module ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // C. Non-existent IDs (returns 404)
    $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules/999999", null, 'mock-admin-token');
    assertAPI("GET modules with non-existent module ID returns 404", $res['code'] === 404, "Code: " . $res['code']);


    // 10. Delete Module (200) and re-indexing
    if ($moduleId2 && $moduleId1) {
        // Delete Module 2
        $res = makeRequest('DELETE', "/api/courses/{$courseIdA}/modules/{$moduleId2}", null, 'mock-admin-token');
        assertAPI("DELETE /api/courses/{id}/modules/{mod_id} admin deletes Module 2 successfully", $res['code'] === 200, "Code: " . $res['code']);

        // Verify deletion
        $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules/{$moduleId2}", null, 'mock-admin-token');
        assertAPI("GET deleted module details returns 404", $res['code'] === 404, "Code: " . $res['code']);

        // Verify sort order re-indexing: Module 1 (previously sort_order 2) should now be re-indexed to 1!
        $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules", null, 'mock-admin-token');
        $modulesList = $res['body']['data']['modules'] ?? [];
        $reindexed = (count($modulesList) === 1 && (int)$modulesList[0]['id'] === $moduleId1 && (int)$modulesList[0]['sort_order'] === 1);
        assertAPI("Remaining module 1 has been re-indexed to sort_order 1", $res['code'] === 200 && $reindexed, "Code: " . $res['code'] . " List: " . json_encode($modulesList));
    }

    // 11. Additional List Filters & Pagination Checks
    $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules", null, 'mock-admin-token');
    assertAPI("GET list returns pagination metadata structure", isset($res['body']['data']['pagination']['current_page']), "Body: " . json_encode($res['body']));

    $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules?search=Updated", null, 'mock-admin-token');
    $modulesSearchList = $res['body']['data']['modules'] ?? [];
    $hasUpdatedOnly = (count($modulesSearchList) === 1 && str_contains($modulesSearchList[0]['title'], 'Updated'));
    assertAPI("GET list with search filter returns matching module only", $res['code'] === 200 && $hasUpdatedOnly, "Code: " . $res['code'] . " List: " . json_encode($modulesSearchList));

    $res = makeRequest('GET', "/api/courses/{$courseIdA}/modules?status=InvalidStatus", null, 'mock-admin-token');
    assertAPI("GET list with invalid status filter returns 400", $res['code'] === 400, "Code: " . $res['code']);

    // 12. Additional Reorder & Create Failures
    $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules/reorder", [], 'mock-admin-token');
    assertAPI("POST reorder with empty payload returns 400", $res['code'] === 400, "Code: " . $res['code']);

    $res = makeRequest('POST', "/api/courses/999999/modules", ['title' => 'Non-existent Course Module'], 'mock-admin-token');
    assertAPI("POST create module for non-existent course returns 404", $res['code'] === 404, "Code: " . $res['code']);

    // 13. Instructor Ownership (IDOR Boundary) Checks
    if ($courseIdA && $moduleId1) {
        // Change course owner to someone else (ID 2)
        $db->exec("UPDATE courses SET created_by = 2 WHERE id = {$courseIdA}");

        // Now test that instructor (ID 1) cannot write/reorder
        $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", ['title' => 'Instructor Escalation Module'], 'mock-instructor-token');
        assertAPI("POST create module by non-owner instructor is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

        $res = makeRequest('PUT', "/api/courses/{$courseIdA}/modules/{$moduleId1}", ['title' => 'Instructor Escalation Update'], 'mock-instructor-token');
        assertAPI("PUT update module by non-owner instructor is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

        $res = makeRequest('DELETE', "/api/courses/{$courseIdA}/modules/{$moduleId1}", null, 'mock-instructor-token');
        assertAPI("DELETE module by non-owner instructor is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

        $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules/reorder", ['module_ids' => [$moduleId1]], 'mock-instructor-token');
        assertAPI("POST reorder modules by non-owner instructor is Forbidden (403)", $res['code'] === 403, "Code: " . $res['code']);

        // Restore course owner to ID 1
        $db->exec("UPDATE courses SET created_by = 1 WHERE id = {$courseIdA}");

        // Test that owner instructor (ID 1) CAN write/reorder
        $res = makeRequest('POST', "/api/courses/{$courseIdA}/modules", ['title' => 'Instructor Owner Module'], 'mock-instructor-token');
        assertAPI("POST create module by course-owning instructor succeeds (201)", $res['code'] === 201, "Code: " . $res['code']);
    }


} finally {
    // Teardown database entries
    if ($courseIdA) {
        $db->exec("DELETE FROM course_modules WHERE course_id = {$courseIdA}");
        $db->exec("DELETE FROM enrollments WHERE course_id = {$courseIdA}");
        $db->exec("DELETE FROM courses WHERE id = {$courseIdA}");
    }
    if ($courseIdB) {
        $db->exec("DELETE FROM course_modules WHERE course_id = {$courseIdB}");
        $db->exec("DELETE FROM courses WHERE id = {$courseIdB}");
    }
    
    // Shut down PHP built-in web server
    echo "\n" . YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "COURSE MODULES API VERIFICATION COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    echo GREEN . "All Course Modules CRUD REST API endpoints fully conform to validation, authorization, and output requirements!" . NC . "\n";
    exit(0);
} else {
    echo RED . "Some Course Modules REST API verification tests failed." . NC . "\n";
    exit(1);
}
