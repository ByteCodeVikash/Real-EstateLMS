<?php
/**
 * GET /api/courses/{course_id}/resources
 * List all downloadable resources for a course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();
$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;

if ($courseId <= 0) {
    sendResponse(400, null, "Validation Error: Valid course ID is required.");
}

try {
    $db = Database::getConnection();
    
    // Authorization: admins and instructors can see any course resources.
    // Students can see only if they are enrolled in the course.
    if ($currentUser['role'] === 'student') {
        $enrollStmt = $db->prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?");
        $enrollStmt->execute([$currentUser['id'], $courseId]);
        if (!$enrollStmt->fetch()) {
            sendResponse(403, null, "Forbidden: You must be enrolled in this course to access resources.");
        }
    }
    
    $stmt = $db->prepare("
        SELECT r.*, m.title as module_title 
        FROM course_resources r
        LEFT JOIN course_modules m ON r.module_id = m.id
        WHERE r.course_id = ?
        ORDER BY r.created_at DESC
    ");
    $stmt->execute([$courseId]);
    $resources = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($resources as &$res) {
        $res['id'] = (int)$res['id'];
        $res['course_id'] = (int)$res['course_id'];
        if ($res['module_id'] !== null) {
            $res['module_id'] = (int)$res['module_id'];
        }
    }
    
    sendResponse(200, $resources, "Course resources retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
