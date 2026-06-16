<?php
/**
 * GET /api/courses/{id}
 * Retrieve detailed info for a single course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user optionally
$user = null;
$token = getBearerToken();
if ($token) {
    $user = requireAuth();
}

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
    if ($user) {
        if ($user['role'] === 'student') {
            if ($course['status'] !== 'Published') {
                sendResponse(403, null, "Access denied: This course is currently unavailable.");
            }
        } else if ($user['role'] === 'instructor') {
            if ($course['created_by'] !== $user['id'] && $course['status'] !== 'Published') {
                sendResponse(403, null, "Access denied: You do not have permission to view this unpublished course.");
            }
        }
    } else {
        // Unauthenticated guests can only view Published courses
        if ($course['status'] !== 'Published') {
            sendResponse(403, null, "Access denied: This course is currently unavailable.");
        }
    }
    
    // Check enrollment for students
    $isEnrolled = false;
    $enrollmentId = null;
    $progress = 0;
    if ($user && $user['role'] === 'student') {
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

    if ($user && $isEnrolled) {
        $lecStmt = $db->prepare("SELECT l.id, l.title, l.description, l.video_url, l.duration, l.sort_order, l.is_preview, l.video_type, l.video_id,
                                        COALESCE(lp.is_completed, 0) as completed, COALESCE(lp.playhead_seconds, 0) as playhead_seconds, lp.updated_at
                                 FROM lectures l
                                 LEFT JOIN lecture_progress lp ON l.id = lp.lecture_id AND lp.user_id = ?
                                 WHERE l.module_id = ? 
                                 ORDER BY l.sort_order ASC");
    } else {
        $lecStmt = $db->prepare("SELECT id, title, description, video_url, duration, sort_order, is_preview, video_type, video_id,
                                        0 as completed, 0 as playhead_seconds, NULL as updated_at
                                 FROM lectures 
                                 WHERE module_id = ? 
                                 ORDER BY sort_order ASC");
    }

    $modules = [];
    while ($mod = $modStmt->fetch(PDO::FETCH_ASSOC)) {
        $mod['id'] = (int)$mod['id'];
        $mod['sort_order'] = (int)$mod['sort_order'];

        if ($user && $isEnrolled) {
            $lecStmt->execute([$user['id'], $mod['id']]);
        } else {
            $lecStmt->execute([$mod['id']]);
        }
        
        $lectures = [];
        while ($lec = $lecStmt->fetch(PDO::FETCH_ASSOC)) {
            $lec['id'] = (int)$lec['id'];
            $lec['sort_order'] = (int)$lec['sort_order'];
            $lec['is_preview'] = (int)$lec['is_preview'] === 1;
            $lec['completed'] = (int)$lec['completed'] === 1;
            $lec['playhead_seconds'] = (int)$lec['playhead_seconds'];

            // Restrict video url access for student role (or guest) if not enrolled and not preview
            if ((!$user || $user['role'] === 'student') && !$isEnrolled && !$lec['is_preview']) {
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
