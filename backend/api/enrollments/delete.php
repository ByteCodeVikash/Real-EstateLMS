<?php
/**
 * DELETE /api/enrollments/{id}
 * Delete an enrollment record
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user with roles authorized to delete (admins, super admins, instructors)
$currentUser = requireRole(['admin', 'super_admin', 'instructor']);

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Validation Error: Valid enrollment ID is required.");
}

try {
    $db = Database::getConnection();
    
    // Fetch enrollment and join course creator ID
    $stmt = $db->prepare("
        SELECT 
            e.id,
            e.user_id,
            e.course_id,
            c.created_by AS course_creator_id
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.id = ?
    ");
    $stmt->execute([$id]);
    $enrollment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$enrollment) {
        sendResponse(404, null, "Not Found: The requested enrollment does not exist.");
    }
    
    // Enforce ownership validations for instructors
    if ($currentUser['role'] === 'instructor') {
        if ((int)$enrollment['course_creator_id'] !== (int)$currentUser['id']) {
            sendResponse(403, null, "Forbidden: You are not authorized to delete this enrollment record.");
        }
    }
    
    // Delete the enrollment
    $deleteStmt = $db->prepare("DELETE FROM enrollments WHERE id = ?");
    $deleteStmt->execute([$id]);
    
    sendResponse(200, ['id' => $id], "Enrollment deleted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
