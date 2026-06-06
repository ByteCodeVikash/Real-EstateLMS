<?php
/**
 * POST /api/enrollments
 * Enroll current authenticated user in a course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Requires general authentication (Students, Instructors, Admins can all enroll)
$currentUser = requireAuth();

$data = getRequestData();
$courseId = isset($data['course_id']) ? (int)$data['course_id'] : 0;

if ($courseId <= 0) {
    sendResponse(400, null, "Validation Error: Valid course_id is required.");
}

try {
    $db = Database::getConnection();
    
    // 1. Verify course exists and is Published
    $courseStmt = $db->prepare("SELECT id, title, status FROM courses WHERE id = ?");
    $courseStmt->execute([$courseId]);
    $course = $courseStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$course) {
        sendResponse(404, null, "Not Found: The requested course does not exist.");
    }
    
    if ($course['status'] !== 'Published') {
        sendResponse(400, null, "Bad Request: Cannot enroll in a course that is not published.");
    }
    
    // 2. Check if already enrolled
    $checkStmt = $db->prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?");
    $checkStmt->execute([$currentUser['id'], $courseId]);
    if ($checkStmt->fetch()) {
        sendResponse(400, null, "Bad Request: You are already enrolled in this course.");
    }
    
    // 3. Create the enrollment record
    $insertStmt = $db->prepare("INSERT INTO enrollments (user_id, course_id, progress, completion_status, certificate_issued) VALUES (?, ?, 0, 'Active', 0)");
    $insertStmt->execute([$currentUser['id'], $courseId]);
    
    $newId = $db->lastInsertId();
    
    // 4. Retrieve the newly created enrollment
    $getStmt = $db->prepare("SELECT id, user_id, course_id, enrollment_date, progress, completion_status, certificate_issued FROM enrollments WHERE id = ?");
    $getStmt->execute([$newId]);
    $enrollment = $getStmt->fetch(PDO::FETCH_ASSOC);
    
    sendResponse(201, $enrollment, "Enrolled in course successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
