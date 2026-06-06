<?php
/**
 * PUT /api/modules/{module_id}/lectures/{id}
 * Update details of an existing lecture
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user (Admins, Super Admins, and Instructors only)
$user = requireRole(['admin', 'super_admin', 'instructor']);

$moduleId = isset($_GET['module_id']) ? (int)$_GET['module_id'] : 0;
$lectureId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($moduleId <= 0 || $lectureId <= 0) {
    sendResponse(400, null, "Invalid module ID or lecture ID.");
}

$data = getRequestData();

try {
    $db = Database::getConnection();

    // Verify lecture exists and belongs to the specified module
    $lectureStmt = $db->prepare("SELECT * FROM lectures WHERE id = ?");
    $lectureStmt->execute([$lectureId]);
    $lecture = $lectureStmt->fetch(PDO::FETCH_ASSOC);

    if (!$lecture) {
        sendResponse(404, null, "Lecture not found.");
    }

    if ((int)$lecture['module_id'] !== $moduleId) {
        sendResponse(400, null, "Conflict: Lecture does not belong to the specified module.");
    }

    // Verify course module exists and retrieve course_id
    $moduleStmt = $db->prepare("SELECT id, course_id FROM course_modules WHERE id = ?");
    $moduleStmt->execute([$moduleId]);
    $module = $moduleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$module) {
        sendResponse(404, null, "Course module not found.");
    }

    $courseId = (int)$module['course_id'];

    // Verify course exists and retrieve creator id
    $courseStmt = $db->prepare("SELECT id, created_by FROM courses WHERE id = ?");
    $courseStmt->execute([$courseId]);
    $course = $courseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        sendResponse(404, null, "Parent course not found.");
    }

    // Authorization check: Instructors can only update lectures for their own courses
    if ($user['role'] === 'instructor' && (int)$course['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage lectures for this course.");
    }

    // Capture fields or keep current ones
    $title = isset($data['title']) ? trim(strip_tags($data['title'])) : $lecture['title'];
    $description = isset($data['description']) ? trim(strip_tags($data['description'])) : $lecture['description'];
    $duration = isset($data['duration']) ? trim(strip_tags($data['duration'])) : $lecture['duration'];
    $videoUrl = isset($data['video_url']) ? trim(strip_tags($data['video_url'])) : $lecture['video_url'];
    $isPreview = isset($data['is_preview']) ? ($data['is_preview'] ? 1 : 0) : (int)$lecture['is_preview'];
    $videoType = isset($data['video_type']) ? trim(strip_tags($data['video_type'])) : $lecture['video_type'];
    $videoId = isset($data['video_id']) ? trim(strip_tags($data['video_id'])) : $lecture['video_id'];

    if (empty($title)) {
        sendResponse(400, null, "Validation Error: Lecture title cannot be empty.");
    }

    // Update lecture
    $updateStmt = $db->prepare("UPDATE lectures 
                                SET title = ?, description = ?, video_url = ?, duration = ?, is_preview = ?, video_type = ?, video_id = ?
                                WHERE id = ?");
    $updateStmt->execute([
        $title,
        $description ?: null,
        $videoUrl ?: null,
        $duration,
        $isPreview,
        $videoType,
        $videoId ?: null,
        $lectureId
    ]);

    // Fetch and return the updated lecture
    $fetchStmt = $db->prepare("SELECT id, module_id, title, description, video_url, duration, sort_order, is_preview, video_type, video_id FROM lectures WHERE id = ?");
    $fetchStmt->execute([$lectureId]);
    $updatedLecture = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    if ($updatedLecture) {
        $updatedLecture['id'] = (int)$updatedLecture['id'];
        $updatedLecture['module_id'] = (int)$updatedLecture['module_id'];
        $updatedLecture['sort_order'] = (int)$updatedLecture['sort_order'];
        $updatedLecture['is_preview'] = (int)$updatedLecture['is_preview'] === 1;
    }

    sendResponse(200, $updatedLecture, "Lecture updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
