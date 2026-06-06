<?php
/**
 * GET /api/submissions/{id}
 * Retrieve details of a specific assignment submission
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/AssignmentSubmission.php';

// 1. Authenticate user
$user = requireAuth();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid submission ID.");
}

try {
    // 2. Fetch the submission details
    $submission = AssignmentSubmission::findById($id);
    
    if (!$submission) {
        sendResponse(404, null, "Submission not found.");
    }
    
    // 3. Enforce read visibility permission checks
    if (!AssignmentSubmission::hasAccess($user, $id, 'read')) {
        sendResponse(403, null, "Forbidden: You are not authorized to view this submission.");
    }
    
    sendResponse(200, $submission, "Submission details retrieved successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
