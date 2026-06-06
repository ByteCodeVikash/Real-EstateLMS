<?php
/**
 * PUT /api/assignments/{id}
 * Update an existing assignment
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validation.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Assignment.php';

// 1. Authenticate user (Admin, Super Admin, and Instructor only)
$user = requireRole(['admin', 'super_admin', 'instructor']);

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid assignment ID.");
}

try {
    // 2. Verify assignment exists
    $assignment = Assignment::findById($id);
    if (!$assignment) {
        sendResponse(404, null, "Assignment not found.");
    }
    
    // 3. Enforce write update permission checks
    if (!Assignment::hasAccess($user, $id, 'update')) {
        sendResponse(403, null, "Forbidden: You are not authorized to update this assignment.");
    }
    
    // 4. Fetch update payload data
    $data = getRequestData();
    
    // 5. Run validation helper (as update)
    $errors = validateAssignment($data, true, $id);
    if (!empty($errors)) {
        sendResponse(400, $errors, "Validation Error: " . implode(" ", $errors));
    }
    
    // 6. Update database record
    $success = Assignment::update($id, $data);
    
    if (!$success) {
        sendResponse(500, null, "Internal Server Error: Failed to update assignment.");
    }
    
    // 7. Retrieve the updated assignment
    $updatedAssignment = Assignment::findById($id);
    
    sendResponse(200, $updatedAssignment, "Assignment updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
