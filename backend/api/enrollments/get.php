<?php
/**
 * GET /api/enrollments/{id}
 * Retrieve details for a specific enrollment record
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Requires authentication
$currentUser = requireAuth();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Validation Error: Valid enrollment ID is required.");
}

try {
    $db = Database::getConnection();
    
    // Fetch enrollment and join course details
    $stmt = $db->prepare("
        SELECT 
            e.id,
            e.user_id,
            e.course_id,
            e.status,
            e.enrolled_at,
            e.completed_at,
            e.enrollment_date,
            e.progress,
            e.created_at,
            e.updated_at,
            e.completion_status,
            e.certificate_issued,
            c.title AS course_title,
            c.slug AS course_slug,
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
    
    // Authorization Check
    $isOwner = ((int)$enrollment['user_id'] === (int)$currentUser['id']);
    $isAdmin = in_array($currentUser['role'], ['admin', 'super_admin']);
    $isInstructor = ($currentUser['role'] === 'instructor' && (int)$enrollment['course_creator_id'] === (int)$currentUser['id']);
    
    if (!$isOwner && !$isAdmin && !$isInstructor) {
        sendResponse(403, null, "Forbidden: You do not have permissions to access this enrollment record.");
    }
    
    sendResponse(200, $enrollment, "Enrollment retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
