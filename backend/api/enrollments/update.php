<?php
/**
 * PUT /api/enrollments/{id}
 * Update enrollment progress and completion status
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Requires authentication
$currentUser = requireAuth();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Validation Error: Valid enrollment ID is required.");
}

$data = getRequestData();
$progress = isset($data['progress']) ? (int)$data['progress'] : null;
$completionStatus = isset($data['completion_status']) ? trim(strip_tags($data['completion_status'])) : null;
$certificateIssued = isset($data['certificate_issued']) ? (int)$data['certificate_issued'] : null;

if ($progress === null && $completionStatus === null && $certificateIssued === null) {
    sendResponse(400, null, "Validation Error: At least one field (progress, completion_status, certificate_issued) is required to update.");
}

if ($progress !== null && ($progress < 0 || $progress > 100)) {
    sendResponse(400, null, "Validation Error: Progress must be between 0 and 100.");
}

if ($completionStatus !== null && !in_array($completionStatus, ['Active', 'Completed', 'Dropped'])) {
    sendResponse(400, null, "Validation Error: Invalid completion_status value.");
}

try {
    $db = Database::getConnection();
    
    // Fetch enrollment and join course creator ID
    $stmt = $db->prepare("
        SELECT 
            e.id,
            e.user_id,
            e.course_id,
            e.progress,
            e.completion_status,
            e.certificate_issued,
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
        sendResponse(403, null, "Forbidden: You do not have permissions to modify this enrollment record.");
    }
    
    // Security restriction: Students cannot manually set completion status or certificate issued
    if ($currentUser['role'] === 'student') {
        $completionStatus = null;
        $certificateIssued = null;
        if ($progress === null) {
            sendResponse(403, null, "Forbidden: Students are not authorized to update completion status or certificate status directly.");
        }
    }

    // If progress is 100, automatically update status and certificate
    if ($progress === 100) {
        $completionStatus = 'Completed';
        $certificateIssued = 1;
    }
    
    // Build update query
    $fields = [];
    $params = [];
    
    if ($progress !== null) {
        $fields[] = "`progress` = ?";
        $params[] = $progress;
    }
    if ($completionStatus !== null) {
        $fields[] = "`completion_status` = ?";
        $params[] = $completionStatus;
    }
    if ($certificateIssued !== null) {
        $fields[] = "`certificate_issued` = ?";
        $params[] = $certificateIssued;
    }
    
    $params[] = $id;
    $query = "UPDATE enrollments SET " . implode(', ', $fields) . " WHERE id = ?";
    $updateStmt = $db->prepare($query);
    $updateStmt->execute($params);
    
    // Fetch updated enrollment details
    $getStmt = $db->prepare("SELECT id, user_id, course_id, enrollment_date, progress, completion_status, certificate_issued FROM enrollments WHERE id = ?");
    $getStmt->execute([$id]);
    $updatedEnrollment = $getStmt->fetch(PDO::FETCH_ASSOC);
    
    sendResponse(200, $updatedEnrollment, "Enrollment updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
