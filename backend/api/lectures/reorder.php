<?php
/**
 * POST /api/modules/{module_id}/lectures/reorder
 * Reorder lectures within a course module
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user (Admins, Super Admins, and Instructors only)
$user = requireRole(['admin', 'super_admin', 'instructor']);

$moduleId = isset($_GET['module_id']) ? (int)$_GET['module_id'] : 0;
if ($moduleId <= 0) {
    sendResponse(400, null, "Invalid module ID.");
}

$data = getRequestData();
$ids = $data['lecture_ids'] ?? [];

if (empty($ids) || !is_array($ids)) {
    sendResponse(400, null, "Validation Error: Reordering parameter 'lecture_ids' is required and must be an array.");
}

try {
    $db = Database::getConnection();

    // Verify course module exists and retrieve course_id
    $moduleStmt = $db->prepare("SELECT id, course_id FROM course_modules WHERE id = ?");
    $moduleStmt->execute([$moduleId]);
    $module = $moduleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$module) {
        sendResponse(404, null, "Course module not found.");
    }

    $courseId = (int)$module['course_id'];

    // Verify course exists and retrieve creator id
    $courseStmt = $db->prepare("SELECT id, created_by FROM courses WHERE id = ?");
    $courseStmt->execute([$courseId]);
    $course = $courseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        sendResponse(404, null, "Parent course not found.");
    }

    // Authorization check: Instructors can only reorder lectures for their own courses
    if ($user['role'] === 'instructor' && (int)$course['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage lectures for this course.");
    }

    $db->beginTransaction();

    $updateSort = $db->prepare("UPDATE lectures SET sort_order = ? WHERE id = ? AND module_id = ?");

    $sort = 1;
    foreach ($ids as $id) {
        $updateSort->execute([$sort++, (int)$id, $moduleId]);
    }

    $db->commit();

    sendResponse(200, null, "Lectures reordered successfully.");
} catch (PDOException $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
