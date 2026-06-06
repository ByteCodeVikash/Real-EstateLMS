<?php
/**
 * GET /api/submissions/course/{course_id}
 * Retrieve all student submissions for a specific course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/AssignmentSubmission.php';

// 1. Authenticate user
$user = requireAuth();

// 2. Validate user role (Admin or Instructor)
if (!isset($user['role']) || !in_array($user['role'], ['super_admin', 'admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators and instructors can view course submissions.");
}

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;

if ($courseId <= 0) {
    sendResponse(400, null, "Invalid course ID.");
}

try {
    $db = Database::getConnection();
    
    // 3. Verify course exists and retrieve ownership info
    $stmt = $db->prepare("SELECT created_by FROM courses WHERE id = ?");
    $stmt->execute([$courseId]);
    $courseCreator = $stmt->fetchColumn();
    
    if ($courseCreator === false) {
        sendResponse(404, null, "Course not found.");
    }

    // 4. Instructor access scope check: must have created/own the course
    if ($user['role'] === 'instructor' && (int)$courseCreator !== (int)$user['id']) {
        sendResponse(403, null, "Forbidden: You are not authorized to view submissions for this course.");
    }

    // 5. Fetch all submissions for the course
    $submissions = AssignmentSubmission::findByCourse($courseId);

    sendResponse(200, ['submissions' => $submissions], "Course submissions retrieved successfully.");

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
