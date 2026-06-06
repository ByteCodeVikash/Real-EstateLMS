<?php
/**
 * DELETE /api/assignments/{id}
 * Delete an existing assignment
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
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
    
    // 3. Enforce deletion permission checks
    if (!Assignment::hasAccess($user, $id, 'delete')) {
        sendResponse(403, null, "Forbidden: You are not authorized to delete this assignment.");
    }
    
    // 4. Perform database deletion
    $success = Assignment::delete($id);
    
    if (!$success) {
        sendResponse(500, null, "Internal Server Error: Failed to delete assignment.");
    }
    
    sendResponse(200, ['id' => $id], "Assignment deleted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
