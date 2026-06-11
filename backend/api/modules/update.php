<?php
/**
 * PUT /api/courses/{course_id}/modules/{id}
 * Update a course module
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user
$user = requireRole(['admin', 'super_admin', 'instructor']);

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
$moduleId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($courseId <= 0 || $moduleId <= 0) {
    sendResponse(400, null, "Invalid parameters.");
}

$data = getRequestData();

try {
    $db = Database::getConnection();

    // Verify module exists and matches course
    $moduleStmt = $db->prepare("SELECT m.*, c.created_by 
                                FROM course_modules m 
                                JOIN courses c ON m.course_id = c.id 
                                WHERE m.id = ? AND m.course_id = ?");
    $moduleStmt->execute([$moduleId, $courseId]);
    $module = $moduleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$module) {
        sendResponse(404, null, "Module not found or course mismatch.");
    }

    // Authorization check: Instructors can only edit modules of their own courses
    if ($user['role'] === 'instructor' && (int)$module['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage modules for this course.");
    }

    // Assemble fields to update
    $title = isset($data['title']) ? trim(strip_tags($data['title'])) : $module['title'];
    $description = isset($data['description']) ? trim(strip_tags($data['description'])) : $module['description'];
    $status = isset($data['status']) ? trim($data['status']) : $module['status'];

    $allowedStatuses = ['Draft', 'Published', 'Archived'];
    if (!in_array($status, $allowedStatuses)) {
        sendResponse(400, null, "Validation Error: Invalid status. Allowed: Draft, Published, Archived.");
    }
    
    if (isset($data['lectures'])) {
        $lectures = is_array($data['lectures']) ? json_encode($data['lectures']) : $module['lectures'];
    } else {
        $lectures = $module['lectures'];
    }

    if (empty($title)) {
        sendResponse(400, null, "Validation Error: Module title cannot be empty.");
    }

    // Perform update
    $updateStmt = $db->prepare("UPDATE course_modules 
                                SET title = ?, description = ?, status = ?, lectures = ? 
                                WHERE id = ?");
    $updateStmt->execute([$title, $description, $status, $lectures, $moduleId]);

    // Fetch and return updated module
    $fetchStmt = $db->prepare("SELECT id, course_id, title, description, sort_order, status, created_at, updated_at 
                               FROM course_modules 
                               WHERE id = ?");
    $fetchStmt->execute([$moduleId]);
    $updatedModule = $fetchStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($updatedModule) {
        $updatedModule['id'] = (int)$updatedModule['id'];
        $updatedModule['course_id'] = (int)$updatedModule['course_id'];
        $updatedModule['sort_order'] = (int)$updatedModule['sort_order'];
        $updatedModule['lectures'] = json_decode($updatedModule['lectures'], true);
    }

    sendResponse(200, $updatedModule, "Module updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
