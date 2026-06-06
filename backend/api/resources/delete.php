<?php
/**
 * DELETE /api/courses/{course_id}/resources/{id}
 * Delete a resource from a course (Admins, Instructors, Super Admins only)
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

// Authorization: admin, super_admin, instructor only
if (!in_array($currentUser['role'], ['admin', 'super_admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators or instructors can delete resources.");
}

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($courseId <= 0 || $id <= 0) {
    sendResponse(400, null, "Validation Error: Valid course ID and resource ID are required.");
}

try {
    $db = Database::getConnection();
    
    // Check if resource exists and belongs to the course
    $checkStmt = $db->prepare("SELECT file_path FROM course_resources WHERE id = ? AND course_id = ?");
    $checkStmt->execute([$id, $courseId]);
    $resource = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$resource) {
        sendResponse(404, null, "Not Found: Resource does not exist or does not belong to this course.");
    }
    
    // Attempt to delete physical file if inside uploads/resources
    $filePath = $resource['file_path'];
    if (strpos($filePath, '/uploads/resources/') === 0) {
        $fullPath = __DIR__ . '/../../' . ltrim($filePath, '/');
        if (file_exists($fullPath) && is_file($fullPath)) {
            @unlink($fullPath);
        }
    }
    
    $stmt = $db->prepare("DELETE FROM course_resources WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(200, null, "Resource deleted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
