<?php
/**
 * DELETE /api/courses/{course_id}/modules/{id}
 * Delete a course module
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user
$user = requireRole(['admin', 'super_admin', 'instructor']);

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
$moduleId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($courseId <= 0 || $moduleId <= 0) {
    sendResponse(400, null, "Invalid parameters.");
}

try {
    $db = Database::getConnection();

    // Verify module exists and matches course
    $moduleStmt = $db->prepare("SELECT m.*, c.created_by 
                                FROM course_modules m 
                                JOIN courses c ON m.course_id = c.id 
                                WHERE m.id = ? AND m.course_id = ?");
    $moduleStmt->execute([$moduleId, $courseId]);
    $module = $moduleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$module) {
        sendResponse(404, null, "Module not found or course mismatch.");
    }

    // Authorization check: Instructors can only delete modules of their own courses
    if ($user['role'] === 'instructor' && (int)$module['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage modules for this course.");
    }

    // Perform deletion
    $deleteStmt = $db->prepare("DELETE FROM course_modules WHERE id = ?");
    $deleteStmt->execute([$moduleId]);

    // Re-index remaining modules for order integrity
    $selectRemaining = $db->prepare("SELECT id FROM course_modules WHERE course_id = ? ORDER BY sort_order ASC");
    $selectRemaining->execute([$courseId]);
    $remainingIds = $selectRemaining->fetchAll(PDO::FETCH_COLUMN);
    
    $updateSort = $db->prepare("UPDATE course_modules SET sort_order = ? WHERE id = ?");
    $newSort = 1;
    foreach ($remainingIds as $remId) {
        $updateSort->execute([$newSort++, $remId]);
    }

    sendResponse(200, null, "Module deleted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
