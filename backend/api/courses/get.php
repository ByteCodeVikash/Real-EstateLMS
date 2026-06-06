<?php
/**
 * GET /api/courses/{id}
 * Retrieve detailed info for a single course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user
$user = requireAuth();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid course ID.");
}

try {
    $db = Database::getConnection();
    
    $stmt = $db->prepare("SELECT c.*, cat.name as category_name 
                          FROM courses c 
                          LEFT JOIN categories cat ON c.category_id = cat.id 
                          WHERE c.id = ?");
    $stmt->execute([$id]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$course) {
        sendResponse(404, null, "Course not found.");
    }
    
    // Role-based authorization visibility checks
    if ($user['role'] === 'student') {
        if ($course['status'] !== 'Published') {
            sendResponse(403, null, "Access denied: This course is currently unavailable.");
        }
    } else if ($user['role'] === 'instructor') {
        if ($course['created_by'] !== $user['id'] && $course['status'] !== 'Published') {
            sendResponse(403, null, "Access denied: You do not have permission to view this unpublished course.");
        }
    }
    
    // Check enrollment for students
    $isEnrolled = false;
    $enrollmentId = null;
    $progress = 0;
    if ($user['role'] === 'student') {
        $enrollStmt = $db->prepare("SELECT id, progress FROM enrollments WHERE user_id = ? AND course_id = ?");
        $enrollStmt->execute([$user['id'], $id]);
        $enroll = $enrollStmt->fetch(PDO::FETCH_ASSOC);
        if ($enroll) {
            $isEnrolled = true;
            $enrollmentId = (int)$enroll['id'];
            $progress = (int)$enroll['progress'];
        }
    }
    $course['is_enrolled'] = $isEnrolled;
    $course['enrollment_id'] = $enrollmentId;
    $course['progress'] = $progress;

    // Fetch modules from course_modules table
    $modStmt = $db->prepare("SELECT id, title, description, sort_order 
                             FROM course_modules 
                             WHERE course_id = ? 
                             ORDER BY sort_order ASC");
    $modStmt->execute([$id]);

    $lecStmt = $db->prepare("SELECT id, title, description, video_url, duration, sort_order, is_preview, video_type, video_id 
                             FROM lectures 
                             WHERE module_id = ? 
                             ORDER BY sort_order ASC");

    $modules = [];
    while ($mod = $modStmt->fetch(PDO::FETCH_ASSOC)) {
        $mod['id'] = (int)$mod['id'];
        $mod['sort_order'] = (int)$mod['sort_order'];

        $lecStmt->execute([$mod['id']]);
        $lectures = [];
        while ($lec = $lecStmt->fetch(PDO::FETCH_ASSOC)) {
            $lec['id'] = (int)$lec['id'];
            $lec['sort_order'] = (int)$lec['sort_order'];
            $lec['is_preview'] = (int)$lec['is_preview'] === 1;

            // Restrict video url access for student role if not enrolled and not preview
            if ($user['role'] === 'student' && !$isEnrolled && !$lec['is_preview']) {
                $lec['video_url'] = null;
                $lec['video_id'] = null;
            }
            $lectures[] = $lec;
        }
        $mod['lectures'] = $lectures;
        $modules[] = $mod;
    }
    $course['modules'] = $modules;
    unset($course['curriculum']);
    
    if (isset($course['price'])) {
        $course['price'] = (float)$course['price'];
    }
    
    sendResponse(200, $course, "Course details retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
