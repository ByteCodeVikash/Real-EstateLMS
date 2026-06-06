<?php
/**
 * GET /api/assignments/{id}
 * Retrieve details of a single assignment
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Assignment.php';

// 1. Authenticate user
$user = requireAuth();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid assignment ID.");
}

try {
    // 2. Fetch the assignment details
    $assignment = Assignment::findById($id);
    
    if (!$assignment) {
        sendResponse(404, null, "Assignment not found.");
    }
    
    // 3. Enforce read visibility permission checks
    if (!Assignment::hasAccess($user, $id, 'read')) {
        sendResponse(403, null, "Forbidden: You are not authorized to view this assignment.");
    }
    
    sendResponse(200, $assignment, "Assignment details retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
