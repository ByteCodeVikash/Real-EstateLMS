<?php
/**
 * POST /api/courses/{course_id}/modules
 * Create a new course module
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user
$user = requireRole(['admin', 'super_admin', 'instructor']);

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
if ($courseId <= 0) {
    sendResponse(400, null, "Invalid course ID.");
}

$data = getRequestData();
$title = trim(strip_tags($data['title'] ?? ''));
$description = trim(strip_tags($data['description'] ?? ''));
$lectures = isset($data['lectures']) && is_array($data['lectures']) ? $data['lectures'] : [];
$status = trim($data['status'] ?? 'Draft');

$allowedStatuses = ['Draft', 'Published', 'Archived'];
if (!in_array($status, $allowedStatuses)) {
    sendResponse(400, null, "Validation Error: Invalid status. Allowed: Draft, Published, Archived.");
}

if (empty($title)) {
    sendResponse(400, null, "Validation Error: Module title is required.");
}

try {
    $db = Database::getConnection();

    // Verify course exists
    $courseStmt = $db->prepare("SELECT id, created_by FROM courses WHERE id = ?");
    $courseStmt->execute([$courseId]);
    $course = $courseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        sendResponse(404, null, "Course not found.");
    }

    // Authorization: Instructors can only create modules in their own courses
    if ($user['role'] === 'instructor' && (int)$course['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage modules for this course.");
    }

    // Duplicate title check: prevent two modules with the same title in the same course
    $dupStmt = $db->prepare(
        "SELECT id FROM course_modules WHERE course_id = ? AND LOWER(title) = LOWER(?)"
    );
    $dupStmt->execute([$courseId, $title]);
    if ($dupStmt->fetch()) {
        sendResponse(409, null, "Conflict: A module with this title already exists in the course.");
    }

    // Determine sort order
    $sortStmt = $db->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM course_modules WHERE course_id = ?");
    $sortStmt->execute([$courseId]);
    $nextSort = (int)$sortStmt->fetchColumn();

    // Insert module
    $insertStmt = $db->prepare("INSERT INTO course_modules (course_id, title, description, sort_order, status, lectures) VALUES (?, ?, ?, ?, ?, ?)");
    $insertStmt->execute([
        $courseId,
        $title,
        $description ?: null,
        $nextSort,
        $status,
        json_encode($lectures)
    ]);
    
    $newId = (int)$db->lastInsertId();

    // Fetch created module
    $fetchStmt = $db->prepare("SELECT id, course_id, title, description, sort_order, status, created_at, updated_at FROM course_modules WHERE id = ?");
    $fetchStmt->execute([$newId]);
    $newModule = $fetchStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($newModule) {
        $newModule['id'] = (int)$newModule['id'];
        $newModule['course_id'] = (int)$newModule['course_id'];
        $newModule['sort_order'] = (int)$newModule['sort_order'];
        $newModule['lectures'] = json_decode($newModule['lectures'], true);
    }

    sendResponse(201, $newModule, "Module created successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
