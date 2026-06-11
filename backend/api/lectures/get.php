<?php
/**
 * GET /api/lectures/{id}
 * Retrieve details of a single lecture with role-based visibility
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// 1. Authenticate user
$user = requireAuth();

$lectureId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($lectureId <= 0) {
    sendResponse(400, null, "Invalid lecture ID.");
}

try {
    $db = Database::getConnection();

    // Fetch lecture and join module/course info
    $stmt = $db->prepare("
        SELECT l.*, m.course_id, m.title AS module_title
        FROM lectures l
        INNER JOIN course_modules m ON l.module_id = m.id
        INNER JOIN courses c ON m.course_id = c.id
        WHERE l.id = ?
    ");
    $stmt->execute([$lectureId]);
    $lecture = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lecture) {
        sendResponse(404, null, "Lecture not found.");
    }

    // Role-based visibility
    if ($user['role'] === 'student') {
        // Students can only view Published lectures
        if ($lecture['status'] !== 'Published') {
            sendResponse(403, null, "Access denied: This lecture is not available.");
        }

        // Check if student is enrolled in the parent course
        $enrollStmt = $db->prepare("
            SELECT id FROM enrollments 
            WHERE user_id = ? AND course_id = ?
        ");
        $enrollStmt->execute([$user['id'], (int)$lecture['course_id']]);
        $isEnrolled = (bool)$enrollStmt->fetch();

        // If not enrolled and not preview, redact video fields
        if (!$isEnrolled && !(int)$lecture['is_preview']) {
            $lecture['video_url'] = null;
            $lecture['video_id']  = null;
        }
    }

    // Cast types
    $lecture['id'] = (int)$lecture['id'];
    $lecture['module_id'] = (int)$lecture['module_id'];
    $lecture['course_id'] = (int)$lecture['course_id'];
    $lecture['sort_order'] = (int)$lecture['sort_order'];
    $lecture['is_preview'] = (int)$lecture['is_preview'] === 1;

    sendResponse(200, $lecture, "Lecture retrieved successfully.");

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
