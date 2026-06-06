<?php
/**
 * POST /api/assignments
 * Create a new assignment
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validation.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Assignment.php';

// 1. Authenticate user (Admin, Super Admin, and Instructor only)
$user = requireRole(['admin', 'super_admin', 'instructor']);

// 2. Fetch raw body content
$data = getRequestData();

$courseId = isset($data['course_id']) ? (int)$data['course_id'] : 0;

// 3. Enforce course ownership permissions for instructors
if (!Assignment::hasAccess($user, null, 'create', $courseId)) {
    sendResponse(403, null, "Forbidden: You are not authorized to create assignments for this course.");
}

// 4. Set created_by for validation and creation
$data['created_by'] = $user['id'];

// 5. Run validation helper
$errors = validateAssignment($data, false);
if (!empty($errors)) {
    sendResponse(400, $errors, "Validation Error: " . implode(" ", $errors));
}

try {
    // 6. Insert new assignment
    $newId = Assignment::create($data);
    
    if (!$newId) {
        sendResponse(500, null, "Internal Server Error: Failed to create assignment.");
    }
    
    // 7. Retrieve the newly created assignment
    $assignment = Assignment::findById($newId);
    
    sendResponse(201, $assignment, "Assignment created successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
