<?php
/**
 * PUT /api/lectures/{id}
 * PUT /api/modules/{module_id}/lectures/{id}
 * Update details of an existing lecture
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user (Admins, Super Admins, and Instructors only)
$user = requireRole(['admin', 'super_admin', 'instructor']);

$pathModuleId = isset($_GET['module_id']) ? (int)$_GET['module_id'] : 0;
$lectureId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($lectureId <= 0) {
    sendResponse(400, null, "Invalid lecture ID.");
}

$data = getRequestData();

try {
    $db = Database::getConnection();

    // 1. Verify lecture exists
    $lectureStmt = $db->prepare("SELECT * FROM lectures WHERE id = ?");
    $lectureStmt->execute([$lectureId]);
    $lecture = $lectureStmt->fetch(PDO::FETCH_ASSOC);

    if (!$lecture) {
        sendResponse(404, null, "Lecture not found.");
    }

    $originalModuleId = (int)$lecture['module_id'];

    // If legacy endpoint was used, confirm the lecture belongs to that module
    if ($pathModuleId > 0 && $originalModuleId !== $pathModuleId) {
        sendResponse(400, null, "Conflict: Lecture does not belong to the specified module.");
    }

    // Verify course module exists and retrieve course_id for permissions check
    $originalModuleStmt = $db->prepare("SELECT id, course_id FROM course_modules WHERE id = ?");
    $originalModuleStmt->execute([$originalModuleId]);
    $originalModule = $originalModuleStmt->fetch(PDO::FETCH_ASSOC);

    if (!$originalModule) {
        sendResponse(404, null, "Original course module not found.");
    }

    $originalCourseId = (int)$originalModule['course_id'];

    // Verify course exists and retrieve creator id
    $originalCourseStmt = $db->prepare("SELECT id, created_by FROM courses WHERE id = ?");
    $originalCourseStmt->execute([$originalCourseId]);
    $originalCourse = $originalCourseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$originalCourse) {
        sendResponse(404, null, "Original parent course not found.");
    }

    // Authorization check on original course: Instructors can only manage lectures for their own courses
    if ($user['role'] === 'instructor' && (int)$originalCourse['created_by'] !== (int)$user['id']) {
        sendResponse(403, null, "Access denied: You do not have permission to manage lectures for this course.");
    }

    // 2. Determine target module and sort order (supports transferring lectures between modules)
    $targetModuleId = isset($data['module_id']) ? (int)$data['module_id'] : $originalModuleId;
    $targetSortOrder = (int)$lecture['sort_order'];
    $moduleChanged = ($targetModuleId !== $originalModuleId);

    if ($moduleChanged) {
        // Verify target module exists and retrieve course_id
        $targetModuleStmt = $db->prepare("SELECT id, course_id FROM course_modules WHERE id = ?");
        $targetModuleStmt->execute([$targetModuleId]);
        $targetModule = $targetModuleStmt->fetch(PDO::FETCH_ASSOC);

        if (!$targetModule) {
            sendResponse(404, null, "Target course module not found.");
        }

        $targetCourseId = (int)$targetModule['course_id'];

        // Verify target course exists
        $targetCourseStmt = $db->prepare("SELECT id, created_by FROM courses WHERE id = ?");
        $targetCourseStmt->execute([$targetCourseId]);
        $targetCourse = $targetCourseStmt->fetch(PDO::FETCH_ASSOC);

        if (!$targetCourse) {
            sendResponse(404, null, "Target parent course not found.");
        }

        // Authorization check on target course (if changing module)
        if ($user['role'] === 'instructor' && (int)$targetCourse['created_by'] !== (int)$user['id']) {
            sendResponse(403, null, "Access denied: You do not have permission to transfer lectures to this course.");
        }

        // Determine next sort order in target module
        $sortStmt = $db->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM lectures WHERE module_id = ?");
        $sortStmt->execute([$targetModuleId]);
        $targetSortOrder = (int)$sortStmt->fetchColumn();
    }

    // 3. Process fields
    $title = isset($data['title']) ? trim(strip_tags($data['title'])) : $lecture['title'];
    $description = isset($data['description']) ? trim(strip_tags($data['description'])) : $lecture['description'];
    $duration = isset($data['duration']) ? trim(strip_tags($data['duration'])) : $lecture['duration'];
    $videoUrl = isset($data['video_url']) ? trim(strip_tags($data['video_url'])) : $lecture['video_url'];
    $isPreview = isset($data['is_preview']) ? ($data['is_preview'] ? 1 : 0) : (int)$lecture['is_preview'];
    $videoType = isset($data['video_type']) ? trim(strip_tags($data['video_type'])) : $lecture['video_type'];
    $videoId = isset($data['video_id']) ? trim(strip_tags($data['video_id'])) : $lecture['video_id'];
    $status = isset($data['status']) ? trim($data['status']) : $lecture['status'];

    if (empty($title)) {
        sendResponse(400, null, "Validation Error: Lecture title cannot be empty.");
    }

    $allowedStatuses = ['Draft', 'Published', 'Archived'];
    if (!in_array($status, $allowedStatuses)) {
        sendResponse(400, null, "Validation Error: Invalid status. Allowed: Draft, Published, Archived.");
    }

    // 4. Duplicate prevention check
    $dupStmt = $db->prepare("SELECT id FROM lectures WHERE module_id = ? AND LOWER(title) = LOWER(?) AND id != ?");
    $dupStmt->execute([$targetModuleId, $title, $lectureId]);
    if ($dupStmt->fetch()) {
        sendResponse(409, null, "Conflict: A lecture with this title already exists in the target module.");
    }

    // 5. Update with transaction if changing modules
    $db->beginTransaction();

    if ($moduleChanged) {
        // Shift down sort orders in original module
        $shiftStmt = $db->prepare("
            UPDATE lectures 
            SET sort_order = sort_order - 1 
            WHERE module_id = ? AND sort_order > ?
        ");
        $shiftStmt->execute([$originalModuleId, (int)$lecture['sort_order']]);
    }

    $updateStmt = $db->prepare("
        UPDATE lectures 
        SET module_id = ?, title = ?, description = ?, video_url = ?, duration = ?, 
            sort_order = ?, status = ?, is_preview = ?, video_type = ?, video_id = ?
        WHERE id = ?
    ");
    $updateStmt->execute([
        $targetModuleId,
        $title,
        $description ?: null,
        $videoUrl ?: null,
        $duration,
        $targetSortOrder,
        $status,
        $isPreview,
        $videoType,
        $videoId ?: null,
        $lectureId
    ]);

    $db->commit();

    // 6. Fetch and return updated lecture
    $fetchStmt = $db->prepare("
        SELECT id, module_id, title, description, video_url, duration, 
               sort_order, status, is_preview, video_type, video_id 
        FROM lectures WHERE id = ?
    ");
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
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
