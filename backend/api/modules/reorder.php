<?php
/**
 * POST /api/courses/{course_id}/modules/reorder
 * Reorder course modules
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user
$user = requireRole(['admin', 'super_admin', 'instructor']);

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
if ($courseId <= 0) {
    sendResponse(400, null, "Invalid course ID.");
}

$data = getRequestData();
$ids = $data['module_ids'] ?? [];
$orders = $data['orders'] ?? [];

if (empty($ids) && empty($orders)) {
    sendResponse(400, null, "Validation Error: Reordering parameter 'module_ids' or 'orders' is required.");
}

try {
    $db = Database::getConnection();

    // Verify course exists
    $courseStmt = $db->prepare("SELECT id, created_by FROM courses WHERE id = ?");
    $courseStmt->execute([$courseId]);
    $course = $courseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        sendResponse(404, null, "Course not found.");
    }

    // Authorization: Instructors can only reorder modules in their own courses
    if ($user['role'] === 'instructor' && (int)$course['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage modules for this course.");
    }

    $db->beginTransaction();

    $updateSort = $db->prepare("UPDATE course_modules SET sort_order = ? WHERE id = ? AND course_id = ?");

    if (!empty($ids)) {
        $sort = 1;
        foreach ($ids as $id) {
            $updateSort->execute([$sort++, (int)$id, $courseId]);
        }
    } else {
        foreach ($orders as $item) {
            $updateSort->execute([(int)$item['sort_order'], (int)$item['id'], $courseId]);
        }
    }

    $db->commit();

    sendResponse(200, null, "Modules reordered successfully.");
} catch (PDOException $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
