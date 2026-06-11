<?php
/**
 * DELETE /api/lectures/{id}
 * DELETE /api/modules/{module_id}/lectures/{id}
 * Delete a lecture and re-index subsequent sort orders within the module
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user (Admins, Super Admins, and Instructors only)
$user = requireRole(['admin', 'super_admin', 'instructor']);

$pathModuleId = isset($_GET['module_id']) ? (int)$_GET['module_id'] : 0;
$lectureId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($lectureId <= 0) {
    sendResponse(400, null, "Invalid lecture ID.");
}

try {
    $db = Database::getConnection();

    // Verify lecture exists
    $lectureStmt = $db->prepare("SELECT * FROM lectures WHERE id = ?");
    $lectureStmt->execute([$lectureId]);
    $lecture = $lectureStmt->fetch(PDO::FETCH_ASSOC);

    if (!$lecture) {
        sendResponse(404, null, "Lecture not found.");
    }

    $moduleId = (int)$lecture['module_id'];

    if ($pathModuleId > 0 && $moduleId !== $pathModuleId) {
        sendResponse(400, null, "Conflict: Lecture does not belong to the specified module.");
    }

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

    // Authorization check: Instructors can only delete lectures in their own courses
    if ($user['role'] === 'instructor' && (int)$course['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage lectures for this course.");
    }

    $deletedSortOrder = (int)$lecture['sort_order'];

    // Begin transaction for safe sort adjustments
    $db->beginTransaction();

    // Delete the lecture
    $deleteStmt = $db->prepare("DELETE FROM lectures WHERE id = ?");
    $deleteStmt->execute([$lectureId]);

    // Shift subsequent sort_order values down by 1 to fill the gap
    $shiftStmt = $db->prepare("UPDATE lectures 
                               SET sort_order = sort_order - 1 
                               WHERE module_id = ? AND sort_order > ?");
    $shiftStmt->execute([$moduleId, $deletedSortOrder]);

    $db->commit();

    sendResponse(200, null, "Lecture deleted and subsequent sort orders reindexed successfully.");
} catch (PDOException $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
