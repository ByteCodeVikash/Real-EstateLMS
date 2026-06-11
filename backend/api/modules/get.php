<?php
/**
 * GET /api/courses/{course_id}/modules/{id}
 * Retrieve a single course module with its lectures.
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$user = requireAuth();

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
$moduleId = isset($_GET['id'])        ? (int)$_GET['id']        : 0;

if ($courseId <= 0 || $moduleId <= 0) {
    sendResponse(400, null, "Invalid parameters.");
}

try {
    $db = Database::getConnection();

    // Fetch module — confirm it belongs to the course
    $stmt = $db->prepare(
        "SELECT m.id, m.course_id, m.title, m.description, m.sort_order, m.status,
                m.created_at, m.updated_at
         FROM course_modules m
         WHERE m.id = ? AND m.course_id = ?"
    );
    $stmt->execute([$moduleId, $courseId]);
    $module = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$module) {
        sendResponse(404, null, "Module not found.");
    }

    // Role-based visibility: students may only view Published modules
    if ($user['role'] === 'student' && $module['status'] !== 'Published') {
        sendResponse(403, null, "Access denied: This module is not available.");
    }

    // Cast types
    $module['id']         = (int)$module['id'];
    $module['course_id']  = (int)$module['course_id'];
    $module['sort_order'] = (int)$module['sort_order'];

    // Fetch child lectures ordered by sort_order
    $lecStmt = $db->prepare(
        "SELECT id, module_id, title, description, video_url, duration,
                sort_order, is_preview, video_type, video_id, created_at, updated_at
         FROM lectures
         WHERE module_id = ?
         ORDER BY sort_order ASC"
    );
    $lecStmt->execute([$moduleId]);
    $lectures = [];

    // Check course enrollment for students (controls video URL visibility)
    $isEnrolled = false;
    if ($user['role'] === 'student') {
        $enrollStmt = $db->prepare(
            "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?"
        );
        $enrollStmt->execute([$user['id'], $courseId]);
        $isEnrolled = (bool)$enrollStmt->fetch();
    }

    while ($lec = $lecStmt->fetch(PDO::FETCH_ASSOC)) {
        $lec['id']         = (int)$lec['id'];
        $lec['module_id']  = (int)$lec['module_id'];
        $lec['sort_order'] = (int)$lec['sort_order'];
        $lec['is_preview'] = (int)$lec['is_preview'] === 1;

        // Students not enrolled see video data only for preview lectures
        if ($user['role'] === 'student' && !$isEnrolled && !$lec['is_preview']) {
            $lec['video_url'] = null;
            $lec['video_id']  = null;
        }
        $lectures[] = $lec;
    }

    $module['lectures']       = $lectures;
    $module['lecture_count']  = count($lectures);

    sendResponse(200, $module, "Module retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
