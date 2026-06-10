<?php
/**
 * REST API Verification Script for Category CRUD Endpoints
 * Run via: php backend/tests/verify_categories_api.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "CATEGORY CRUD REST API INTEGRATION TESTING" . NC . "\n";
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
$createdCategoryId = null;
$duplicateSlugCategoryId = null;

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
    // Clean up any old test categories
    $db->exec("DELETE FROM categories WHERE name LIKE '%API Verification%'");

    // 1. GET /api/categories (Unauthenticated)
    $res = makeRequest('GET', '/api/categories');
    assertAPI("GET /api/categories unauthenticated is blocked", $res['code'] === 401, "Code: " . $res['code']);

    // 2. GET /api/categories (Authenticated Student)
    $res = makeRequest('GET', '/api/categories', null, 'mock-student-token');
    assertAPI("GET /api/categories authenticated student is allowed", $res['code'] === 200, "Code: " . $res['code']);

    // 3. POST /api/categories (Student - Blocked)
    $payload = [
        'name' => 'Student Category',
        'slug' => 'student-category',
        'status' => 'Active'
    ];
    $res = makeRequest('POST', '/api/categories', $payload, 'mock-student-token');
    assertAPI("POST /api/categories student role is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

    // 4. POST /api/categories (Admin - Validation Error: Empty Name)
    $payloadInvalid = [
        'name' => '',
        'slug' => 'invalid-empty-name',
        'status' => 'Active'
    ];
    $res = makeRequest('POST', '/api/categories', $payloadInvalid, 'mock-admin-token');
    assertAPI("POST /api/categories validates required fields (empty name)", $res['code'] === 400, "Code: " . $res['code']);

    // 5. POST /api/categories (Admin - Valid Create)
    $payloadValid = [
        'name' => 'API Verification Category',
        'slug' => 'api-verification-cat',
        'description' => 'A category created by API verification testing.',
        'image' => 'https://example.com/api-cat.png',
        'icon' => 'Award',
        'sort_order' => 15,
        'status' => 'Active'
    ];
    $res = makeRequest('POST', '/api/categories', $payloadValid, 'mock-admin-token');
    $success = ($res['code'] === 201 && isset($res['body']['data']['id']));
    assertAPI("POST /api/categories admin creates category successfully", $success, "Code: " . $res['code'] . " Body: " . json_encode($res['body']));
    if ($success) {
        $createdCategoryId = (int)$res['body']['data']['id'];
    }

    // 6. POST /api/categories (Admin - Duplicate Slug Prevention)
    if ($createdCategoryId) {
        $payloadDuplicate = [
            'name' => 'API Verification Duplicate',
            'slug' => 'api-verification-cat',
            'status' => 'Active'
        ];
        $res = makeRequest('POST', '/api/categories', $payloadDuplicate, 'mock-admin-token');
        assertAPI("POST /api/categories duplicate slug prevention checks out", $res['code'] === 409, "Code: " . $res['code']);
    }

    if ($createdCategoryId) {
        // 7. GET /api/categories/{id} (Student - Detail API)
        $res = makeRequest('GET', '/api/categories/' . $createdCategoryId, null, 'mock-student-token');
        assertAPI("GET /api/categories/{id} retrieves category details", $res['code'] === 200 && ($res['body']['data']['name'] ?? '') === 'API Verification Category', "Code: " . $res['code']);

        // 8. GET /api/categories/{id} (Invalid ID: Not Found)
        $res = makeRequest('GET', '/api/categories/999999', null, 'mock-student-token');
        assertAPI("GET /api/categories/{id} with non-existent ID returns 404", $res['code'] === 404, "Code: " . $res['code']);

        // 9. GET /api/categories/{id} (Invalid ID: Invalid type/negative)
        $res = makeRequest('GET', '/api/categories/0', null, 'mock-student-token');
        assertAPI("GET /api/categories/{id} with invalid ID returns 400", $res['code'] === 400, "Code: " . $res['code']);

        // 10. PUT /api/categories/{id} (Student - Blocked)
        $updatePayload = [
            'name' => 'Student Attempt to Update'
        ];
        $res = makeRequest('PUT', '/api/categories/' . $createdCategoryId, $updatePayload, 'mock-student-token');
        assertAPI("PUT /api/categories/{id} student update is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

        // 11. PUT /api/categories/{id} (Admin - Validation Error: Empty Name)
        $updatePayloadInvalid = [
            'name' => ''
        ];
        $res = makeRequest('PUT', '/api/categories/' . $createdCategoryId, $updatePayloadInvalid, 'mock-admin-token');
        assertAPI("PUT /api/categories/{id} validates required fields (empty name)", $res['code'] === 400, "Code: " . $res['code']);

        // 12. PUT /api/categories/{id} (Admin - Duplicate Slug Prevention)
        // First create another category to clash with
        $resOther = makeRequest('POST', '/api/categories', [
            'name' => 'API Verification Clash Category',
            'slug' => 'clash-cat',
            'status' => 'Active'
        ], 'mock-admin-token');
        if ($resOther['code'] === 201) {
            $duplicateSlugCategoryId = (int)$resOther['body']['data']['id'];
            
            // Try to update createdCategory to have the 'clash-cat' slug
            $resClash = makeRequest('PUT', '/api/categories/' . $createdCategoryId, [
                'slug' => 'clash-cat'
            ], 'mock-admin-token');
            assertAPI("PUT /api/categories/{id} duplicate slug validation checks out", $resClash['code'] === 409, "Code: " . $resClash['code']);
        }

        // 13. PUT /api/categories/{id} (Admin - Valid Update)
        $updatePayloadValid = [
            'name' => 'API Verification Category Updated',
            'sort_order' => 88
        ];
        $res = makeRequest('PUT', '/api/categories/' . $createdCategoryId, $updatePayloadValid, 'mock-admin-token');
        assertAPI("PUT /api/categories/{id} admin updates category successfully", $res['code'] === 200 && ($res['body']['data']['name'] ?? '') === 'API Verification Category Updated', "Code: " . $res['code']);

        // 14. GET /api/categories (Pagination verification)
        $res = makeRequest('GET', '/api/categories?page=1&limit=2', null, 'mock-student-token');
        assertAPI("GET /api/categories list supports pagination", $res['code'] === 200 && isset($res['body']['data']['pagination']), "Code: " . $res['code']);

        // 15. GET /api/categories (Search verification)
        $res = makeRequest('GET', '/api/categories?search=Updated', null, 'mock-student-token');
        $hasUpdatedName = false;
        if ($res['code'] === 200 && is_array($res['body']['data'])) {
            foreach ($res['body']['data'] as $cat) {
                if (strpos($cat['name'], 'Updated') !== false) {
                    $hasUpdatedName = true;
                }
            }
        }
        assertAPI("GET /api/categories list supports search filtering", $res['code'] === 200 && $hasUpdatedName, "Code: " . $res['code']);

        // 16. DELETE /api/categories/{id} (Student - Blocked)
        $res = makeRequest('DELETE', '/api/categories/' . $createdCategoryId, null, 'mock-student-token');
        assertAPI("DELETE /api/categories/{id} student delete is Forbidden", $res['code'] === 403, "Code: " . $res['code']);

        // 17. DELETE /api/categories/{id} (Admin - Success)
        $res = makeRequest('DELETE', '/api/categories/' . $createdCategoryId, null, 'mock-admin-token');
        assertAPI("DELETE /api/categories/{id} admin delete succeeds", $res['code'] === 200, "Code: " . $res['code']);
        
        // Clean up clash category
        if ($duplicateSlugCategoryId) {
            makeRequest('DELETE', '/api/categories/' . $duplicateSlugCategoryId, null, 'mock-admin-token');
        }

        // 18. GET /api/categories/{id} (After Delete: Not Found)
        $res = makeRequest('GET', '/api/categories/' . $createdCategoryId, null, 'mock-student-token');
        assertAPI("GET /api/categories/{id} returns 404 after deletion", $res['code'] === 404, "Code: " . $res['code']);
    } else {
        echo RED . "Skipping detail and write REST tests because category creation failed." . NC . "\n";
    }

} finally {
    // Clean up database entries
    if ($createdCategoryId) {
        $db->exec("DELETE FROM categories WHERE id = {$createdCategoryId}");
    }
    if ($duplicateSlugCategoryId) {
        $db->exec("DELETE FROM categories WHERE id = {$duplicateSlugCategoryId}");
    }
    
    // Shut down PHP built-in web server
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
