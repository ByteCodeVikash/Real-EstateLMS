<?php
/**
 * REST API Verification Script for Course CRUD Endpoints
 * Run via: php backend/tests/verify_courses_api.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "COURSE CRUD REST API INTEGRATION TESTING" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// 1. Start built-in PHP web server on localhost:8087 in background
echo YELLOW . "Starting PHP built-in web server on 127.0.0.1:8087..." . NC . "\n";
$serverProcess = proc_open("exec php -S 127.0.0.1:8087 backend/index.php", [
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
    $url = "http://127.0.0.1:8087" . $path;
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
$createdCourseId1 = null;
$createdCourseId2 = null;
$testCategoryId = null;

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
        // Create a test category if none exist
        $db->exec("INSERT INTO categories (name, slug, status) VALUES ('Test Verify Cat', 'test-verify-cat', 'Active')");
        $testCategoryId = (int)$db->lastInsertId();
    } else {
        $testCategoryId = (int)$testCategoryId;
    }

    // Clean up any old test courses
    $db->exec("DELETE FROM courses WHERE title LIKE '%API Verification%'");

    // 1. GET /api/courses (Unauthenticated)
    $res = makeRequest('GET', '/api/courses');
    assertAPI("GET /api/courses unauthenticated is allowed", $res['code'] === 200, "Code: " . $res['code']);

    // 2. GET /api/courses (Authenticated Student)
    $res = makeRequest('GET', '/api/courses', null, 'mock-student-token');
    assertAPI("GET /api/courses authenticated student is allowed", $res['code'] === 200 && isset($res['body']['data']['courses']), "Code: " . $res['code'] . " Body: " . json_encode($res['body']));

    // 3. POST /api/courses (Student - Blocked)
    $payload = [
        'title' => 'Student Course API Verification',
        'category_id' => $testCategoryId,
        'status' => 'Published'
    ];
    $res = makeRequest('POST', '/api/courses', $payload, 'mock-student-token');
    assertAPI("POST /api/courses student role is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

    // 4. POST /api/courses (Admin - Validation Error: Empty Title)
    $payloadInvalid = [
        'title' => '',
        'category_id' => $testCategoryId,
        'status' => 'Draft'
    ];
    $res = makeRequest('POST', '/api/courses', $payloadInvalid, 'mock-admin-token');
    assertAPI("POST /api/courses validates required fields (empty title)", $res['code'] === 400, "Code: " . $res['code']);

    // 5. POST /api/courses (Admin - Validation Error: Non-existent Category ID)
    $payloadInvalidCat = [
        'title' => 'API Verification Invalid Category',
        'category_id' => 999999,
        'status' => 'Draft'
    ];
    $res = makeRequest('POST', '/api/courses', $payloadInvalidCat, 'mock-admin-token');
    assertAPI("POST /api/courses validates category existence", $res['code'] === 400, "Code: " . $res['code']);

    // 6. POST /api/courses (Admin - Validation Error: Invalid Thumbnail format)
    $payloadInvalidThumb = [
        'title' => 'API Verification Invalid Thumbnail',
        'category_id' => $testCategoryId,
        'thumbnail' => 'not-a-valid-preset-or-url-or-extension',
        'status' => 'Draft'
    ];
    $res = makeRequest('POST', '/api/courses', $payloadInvalidThumb, 'mock-admin-token');
    assertAPI("POST /api/courses validates thumbnail format", $res['code'] === 400, "Code: " . $res['code']);

    // 7. POST /api/courses (Admin - Valid Create Course 1)
    $payloadValid1 = [
        'title' => 'API Verification Course One',
        'slug' => 'api-verification-course-one',
        'category_id' => $testCategoryId,
        'description' => 'A course created by API verification testing.',
        'thumbnail' => 'grad-blue',
        'mentor_name' => 'Test Mentor',
        'duration' => '6 Weeks',
        'price' => 199.99,
        'status' => 'Published',
        'modules' => [
            [
                'title' => 'Verification Module 1',
                'description' => 'Module description',
                'lectures' => [
                    [
                        'title' => 'Verification Lecture 1.1',
                        'description' => 'Lecture description',
                        'video_url' => 'https://youtube.com/watch?v=123',
                        'duration' => '10m',
                        'is_preview' => true,
                        'video_type' => 'youtube',
                        'video_id' => '123'
                    ]
                ]
            ]
        ]
    ];
    $res = makeRequest('POST', '/api/courses', $payloadValid1, 'mock-admin-token');
    $success1 = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST /api/courses admin creates course successfully", $success1, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    if ($success1) {
        $createdCourseId1 = (int)$res['body']['data']['id'];
    }

    // 8. POST /api/courses (Admin - Duplicate Slug Prevention)
    if ($createdCourseId1) {
        $payloadDuplicate = [
            'title' => 'API Verification Course Duplicate Slug',
            'slug' => 'api-verification-course-one',
            'category_id' => $testCategoryId,
            'status' => 'Draft'
        ];
        $res = makeRequest('POST', '/api/courses', $payloadDuplicate, 'mock-admin-token');
        assertAPI("POST /api/courses duplicate slug prevention checks out", $res['code'] === 409, "Code: " . $res['code']);
    }

    // Create Course 2 for further testing (unique slug)
    $payloadValid2 = [
        'title' => 'API Verification Course Two',
        'slug' => 'api-verification-course-two',
        'category_id' => $testCategoryId,
        'status' => 'Published'
    ];
    $res = makeRequest('POST', '/api/courses', $payloadValid2, 'mock-admin-token');
    if ($res['code'] === 201 && isset($res['body']['data']['id'])) {
        $createdCourseId2 = (int)$res['body']['data']['id'];
    }

    if ($createdCourseId1 && $createdCourseId2) {
        // 9. GET /api/courses/{id} (Student - Detail API)
        $res = makeRequest('GET', '/api/courses/' . $createdCourseId1, null, 'mock-student-token');
        $validGet = ($res['code'] === 200 && ($res['body']['data']['title'] ?? '') === 'API Verification Course One');
        assertAPI("GET /api/courses/{id} retrieves course details", $validGet, "Code: " . $res['code']);

        // 10. GET /api/courses/{id} (Invalid ID: Not Found)
        $res = makeRequest('GET', '/api/courses/999999', null, 'mock-student-token');
        assertAPI("GET /api/courses/{id} with non-existent ID returns 404", $res['code'] === 404, "Code: " . $res['code']);

        // 11. GET /api/courses/{id} (Invalid ID: Invalid type/negative)
        $res = makeRequest('GET', '/api/courses/0', null, 'mock-student-token');
        assertAPI("GET /api/courses/{id} with invalid ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

        // 12. PUT /api/courses/{id} (Student - Blocked)
        $updatePayload = [
            'title' => 'Student Attempt to Update Course'
        ];
        $res = makeRequest('PUT', '/api/courses/' . $createdCourseId1, $updatePayload, 'mock-student-token');
        assertAPI("PUT /api/courses/{id} student update is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

        // 13. PUT /api/courses/{id} (Admin - Duplicate Slug Prevention)
        // Try to update Course 1 to have Course 2's slug
        $updatePayloadClash = [
            'slug' => 'api-verification-course-two'
        ];
        $res = makeRequest('PUT', '/api/courses/' . $createdCourseId1, $updatePayloadClash, 'mock-admin-token');
        assertAPI("PUT /api/courses/{id} duplicate slug validation checks out", $res['code'] === 409, "Code: " . $res['code']);

        // 14. PUT /api/courses/{id} (Admin - Valid Update)
        $updatePayloadValid = [
            'title' => 'API Verification Course One Updated',
            'duration' => '12 Weeks'
        ];
        $res = makeRequest('PUT', '/api/courses/' . $createdCourseId1, $updatePayloadValid, 'mock-admin-token');
        $validPut = ($res['code'] === 200 && ($res['body']['data']['title'] ?? '') === 'API Verification Course One Updated' && ($res['body']['data']['duration'] ?? '') === '12 Weeks');
        assertAPI("PUT /api/courses/{id} admin updates course successfully", $validPut, "Code: " . $res['code']);

        // 15. GET /api/courses (Pagination verification)
        $res = makeRequest('GET', '/api/courses?page=1&limit=1', null, 'mock-student-token');
        assertAPI("GET /api/courses list supports pagination metadata", $res['code'] === 200 && isset($res['body']['data']['pagination']), "Code: " . $res['code']);

        // 16. GET /api/courses (Search verification)
        $res = makeRequest('GET', '/api/courses?search=Updated', null, 'mock-student-token');
        $hasUpdatedName = false;
        if ($res['code'] === 200 && is_array($res['body']['data']['courses'])) {
            foreach ($res['body']['data']['courses'] as $c) {
                if (strpos($c['title'], 'Updated') !== false) {
                    $hasUpdatedName = true;
                }
            }
        }
        assertAPI("GET /api/courses list supports search filtering", $res['code'] === 200 && $hasUpdatedName, "Code: " . $res['code']);

        // 17. GET /api/courses (Category filtering verification)
        $res = makeRequest('GET', '/api/courses?category_id=' . $testCategoryId, null, 'mock-student-token');
        $hasCat = ($res['code'] === 200 && count($res['body']['data']['courses']) > 0);
        assertAPI("GET /api/courses list supports category filtering", $hasCat, "Code: " . $res['code']);

        // 18. DELETE /api/courses/{id} (Student - Blocked)
        $res = makeRequest('DELETE', '/api/courses/' . $createdCourseId1, null, 'mock-student-token');
        assertAPI("DELETE /api/courses/{id} student delete is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

        // 19. DELETE /api/courses/{id} (Admin - Success)
        $res = makeRequest('DELETE', '/api/courses/' . $createdCourseId1, null, 'mock-admin-token');
        assertAPI("DELETE /api/courses/{id} admin delete succeeds", $res['code'] === 200, "Code: " . $res['code']);

        // 20. GET /api/courses/{id} (After Delete: Not Found)
        $res = makeRequest('GET', '/api/courses/' . $createdCourseId1, null, 'mock-student-token');
        assertAPI("GET /api/courses/{id} returns 404 after deletion", $res['code'] === 404, "Code: " . $res['code']);
    } else {
        echo RED . "Skipping detail and write REST tests because course creation failed." . NC . "\n";
    }

} finally {
    // Clean up database entries
    if ($createdCourseId1) {
        $db->exec("DELETE FROM courses WHERE id = {$createdCourseId1}");
    }
    if ($createdCourseId2) {
        $db->exec("DELETE FROM courses WHERE id = {$createdCourseId2}");
    }
    
    // Shut down PHP built-in web server
    echo "\n" . YELLOW . "Shutting down PHP built-in web server..." . NC . "\n";
    proc_terminate($serverProcess);
    proc_close($serverProcess);
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "COURSE API VERIFICATION COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    echo GREEN . "All Courses CRUD REST API endpoints fully conform to validation, authorization, and output requirements!" . NC . "\n";
    exit(0);
} else {
    echo RED . "Some Course REST API verification tests failed." . NC . "\n";
    exit(1);
}
