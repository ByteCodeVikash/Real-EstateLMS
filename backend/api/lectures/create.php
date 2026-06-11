<?php
/**
 * POST /api/lectures
 * POST /api/modules/{module_id}/lectures
 * Create a new lecture within a course module
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user (Admins, Super Admins, and Instructors only)
$user = requireRole(['admin', 'super_admin', 'instructor']);

$data = getRequestData();

// Extract module_id from path/query parameter or request body
$moduleId = isset($_GET['module_id']) ? (int)$_GET['module_id'] : (isset($data['module_id']) ? (int)$data['module_id'] : 0);

if ($moduleId <= 0) {
    sendResponse(400, null, "Validation Error: Invalid or missing module ID.");
}

$title = trim(strip_tags($data['title'] ?? ''));
$description = trim(strip_tags($data['description'] ?? ''));
$duration = trim(strip_tags($data['duration'] ?? '15m'));
$videoUrl = trim(strip_tags($data['video_url'] ?? ''));
$isPreview = isset($data['is_preview']) && $data['is_preview'] ? 1 : 0;
$videoType = trim(strip_tags($data['video_type'] ?? 'html5'));
$videoId = trim(strip_tags($data['video_id'] ?? ''));
$status = trim($data['status'] ?? 'Draft');

if (empty($title)) {
    sendResponse(400, null, "Validation Error: Lecture title is required.");
}

$allowedStatuses = ['Draft', 'Published', 'Archived'];
if (!in_array($status, $allowedStatuses)) {
    sendResponse(400, null, "Validation Error: Invalid status. Allowed: Draft, Published, Archived.");
}

try {
    $db = Database::getConnection();

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

    // Authorization check: Instructors can only create lectures for their own courses
    if ($user['role'] === 'instructor' && (int)$course['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage lectures for this course.");
    }

    // Duplicate title check within the same module
    $dupStmt = $db->prepare("SELECT id FROM lectures WHERE module_id = ? AND LOWER(title) = LOWER(?)");
    $dupStmt->execute([$moduleId, $title]);
    if ($dupStmt->fetch()) {
        sendResponse(409, null, "Conflict: A lecture with this title already exists in this module.");
    }

    // Determine the next sort order within the module
    $sortStmt = $db->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM lectures WHERE module_id = ?");
    $sortStmt->execute([$moduleId]);
    $nextSort = (int)$sortStmt->fetchColumn();

    // Insert new lecture
    $insertStmt = $db->prepare("
        INSERT INTO lectures (
            module_id, title, description, video_url, duration, 
            sort_order, status, is_preview, video_type, video_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $insertStmt->execute([
        $moduleId,
        $title,
        $description ?: null,
        $videoUrl ?: null,
        $duration,
        $nextSort,
        $status,
        $isPreview,
        $videoType,
        $videoId ?: null
    ]);

    $newId = (int)$db->lastInsertId();

    // Fetch and return the newly created lecture
    $fetchStmt = $db->prepare("
        SELECT id, module_id, title, description, video_url, duration, 
               sort_order, status, is_preview, video_type, video_id 
        FROM lectures WHERE id = ?
    ");
    $fetchStmt->execute([$newId]);
    $lecture = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    if ($lecture) {
        $lecture['id'] = (int)$lecture['id'];
        $lecture['module_id'] = (int)$lecture['module_id'];
        $lecture['sort_order'] = (int)$lecture['sort_order'];
        $lecture['is_preview'] = (int)$lecture['is_preview'] === 1;
    }

    sendResponse(201, $lecture, "Lecture created successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
