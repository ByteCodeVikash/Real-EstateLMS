<?php
/**
 * DELETE /api/courses/{id}
 * Delete a course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user
$user = requireRole(['admin', 'super_admin', 'instructor']);

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid course ID.");
}

try {
    $db = Database::getConnection();
    
    // Check if course exists
    $stmt = $db->prepare("SELECT id, title, created_by FROM courses WHERE id = ?");
    $stmt->execute([$id]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$course) {
        sendResponse(404, null, "Course not found.");
    }
    
    // Enforce ownership validations for instructors
    if ($user['role'] === 'instructor') {
        if ($course['created_by'] !== $user['id']) {
            sendResponse(403, null, "Forbidden: You are not authorized to delete this course.");
        }
    }
    
    // Delete the course
    $stmt = $db->prepare("DELETE FROM courses WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(200, ['id' => $id], "Course deleted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
