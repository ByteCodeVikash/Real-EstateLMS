<?php
/**
 * GET /api/submissions/my
 * Retrieve all submissions for the authenticated student
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/AssignmentSubmission.php';

// 1. Authenticate user
$user = requireAuth();

try {
    // 2. Fetch list of personal submissions
    $submissions = AssignmentSubmission::findByStudent($user['id']);
    
    sendResponse(200, [
        'submissions' => $submissions
    ], "My assignment submissions retrieved successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
