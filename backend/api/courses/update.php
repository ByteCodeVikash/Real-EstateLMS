<?php
/**
 * PUT /api/courses/{id}
 * Update an existing course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user
$user = requireRole(['admin', 'super_admin', 'instructor']);

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid course ID.");
}

$data = getRequestData();

$categoryId = isset($data['category_id']) ? (int)$data['category_id'] : 0;
$title = trim(strip_tags($data['title'] ?? ''));
$description = trim(strip_tags($data['description'] ?? ''));
$thumbnail = trim(strip_tags($data['thumbnail'] ?? ''));
$mentorName = trim(strip_tags($data['mentor_name'] ?? ''));
$duration = trim(strip_tags($data['duration'] ?? ''));
$price = isset($data['price']) ? (float)$data['price'] : null;
$status = trim(strip_tags($data['status'] ?? ''));
$modules = $data['modules'] ?? null;

try {
    $db = Database::getConnection();
    
    // Check if course exists
    $stmt = $db->prepare("SELECT * FROM courses WHERE id = ?");
    $stmt->execute([$id]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$course) {
        sendResponse(404, null, "Course not found.");
    }
    
    // Enforce ownership validations for instructors
    if ($user['role'] === 'instructor') {
        if ($course['created_by'] !== $user['id']) {
            sendResponse(403, null, "Forbidden: You are not authorized to update this course.");
        }
    }
    
    // Keep existing values if not provided
    if (empty($title)) $title = $course['title'];
    if ($categoryId <= 0) $categoryId = $course['category_id'];
    if (empty($description)) $description = $course['description'];
    if (empty($thumbnail)) $thumbnail = $course['thumbnail'];
    if (empty($mentorName)) $mentorName = $course['mentor_name'];
    if (empty($duration)) $duration = $course['duration'];
    if ($price === null) $price = $course['price'];
    if (empty($status)) $status = $course['status'];
    
    if (!in_array($status, ['Draft', 'Published', 'Archived'])) {
        sendResponse(400, null, "Validation Error: Status must be 'Draft', 'Published', or 'Archived'.");
    }
    
    // Validate Category exists
    $stmtCat = $db->prepare("SELECT id FROM categories WHERE id = ?");
    $stmtCat->execute([$categoryId]);
    if (!$stmtCat->fetch()) {
        sendResponse(400, null, "Validation Error: Referenced category does not exist.");
    }
    
    // Validate Thumbnail
    $isValidThumbnail = false;
    if (strpos($thumbnail, 'grad-') === 0) {
        $isValidThumbnail = true;
    } elseif (filter_var($thumbnail, FILTER_VALIDATE_URL)) {
        $isValidThumbnail = true;
    } elseif (preg_match('/^\/?([a-zA-Z0-9_\-\.\/]+)\.(jpg|jpeg|png|gif|svg|webp)$/i', $thumbnail)) {
        $isValidThumbnail = true;
    }
    
    if (!$isValidThumbnail) {
        sendResponse(400, null, "Validation Error: Thumbnail must be a valid preset (grad-*), a valid URL, or a valid path.");
    }
    
    // Generate Slug
    $slug = $data['slug'] ?? '';
    if (empty($slug)) {
        $slug = $title;
    }
    $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9\-]+/', '-', $slug), '-'));
    
    if (empty($slug)) {
        sendResponse(400, null, "Validation Error: Course slug could not be determined.");
    }
    
    // Check for unique slug excluding current course ID
    $stmtSlug = $db->prepare("SELECT id FROM courses WHERE slug = ? AND id != ?");
    $stmtSlug->execute([$slug, $id]);
    if ($stmtSlug->fetch()) {
        sendResponse(409, null, "Conflict: Another course with this slug already exists.");
    }
    
    // Serialize curriculum if provided, else keep existing
    if ($modules !== null) {
        $curriculumJson = json_encode($modules);
    } else {
        $curriculumJson = $course['curriculum'];
    }
    
    // Update course
    $sql = "UPDATE courses 
            SET category_id = ?, title = ?, slug = ?, description = ?, thumbnail = ?, mentor_name = ?, duration = ?, price = ?, status = ?, curriculum = ?
            WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $categoryId,
        $title,
        $slug,
        $description,
        $thumbnail,
        $mentorName,
        $duration,
        $price,
        $status,
        $curriculumJson,
        $id
    ]);
    
    // Sync modules in course_modules table if provided
    if ($modules !== null && is_array($modules)) {
        // Clear old modules (lectures will cascade delete)
        $deleteMod = $db->prepare("DELETE FROM course_modules WHERE course_id = ?");
        $deleteMod->execute([$id]);

        // Insert new modules and lectures
        $insertMod = $db->prepare("INSERT INTO course_modules (course_id, title, description, sort_order) VALUES (?, ?, ?, ?)");
        $insertLec = $db->prepare("INSERT INTO lectures (module_id, title, description, video_url, duration, sort_order, is_preview, video_type, video_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $modSort = 1;
        foreach ($modules as $mod) {
            $modTitle = trim(strip_tags($mod['title'] ?? ''));
            if (empty($modTitle)) {
                $modTitle = "Untitled Section";
            }
            $modDesc = trim(strip_tags($mod['description'] ?? ''));
            $insertMod->execute([$id, $modTitle, $modDesc, $modSort++]);
            $newModId = $db->lastInsertId();

            if (isset($mod['lectures']) && is_array($mod['lectures'])) {
                $lecSort = 1;
                foreach ($mod['lectures'] as $lec) {
                    $lecTitle = trim(strip_tags($lec['title'] ?? ''));
                    if (empty($lecTitle)) {
                        $lecTitle = "Untitled Lesson";
                    }
                    $lecDesc = trim(strip_tags($lec['description'] ?? ''));
                    $lecDuration = trim(strip_tags($lec['duration'] ?? '15m'));
                    $lecVideoUrl = trim(strip_tags($lec['video_url'] ?? ''));
                    $lecIsPreview = isset($lec['is_preview']) && $lec['is_preview'] ? 1 : 0;
                    $lecVideoType = trim(strip_tags($lec['video_type'] ?? 'html5'));
                    $lecVideoId = trim(strip_tags($lec['video_id'] ?? ''));

                    $insertLec->execute([
                        $newModId,
                        $lecTitle,
                        $lecDesc,
                        $lecVideoUrl,
                        $lecDuration,
                        $lecSort++,
                        $lecIsPreview,
                        $lecVideoType,
                        $lecVideoId
                    ]);
                }
            }
        }
    }
    
    // Fetch and return updated course
    $stmt = $db->prepare("SELECT c.*, cat.name as category_name 
                          FROM courses c 
                          LEFT JOIN categories cat ON c.category_id = cat.id 
                          WHERE c.id = ?");
    $stmt->execute([$id]);
    $updatedCourse = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Fetch modules from course_modules
    $modStmt = $db->prepare("SELECT id, title, description, sort_order 
                             FROM course_modules 
                             WHERE course_id = ? 
                             ORDER BY sort_order ASC");
    $modStmt->execute([$id]);
    
    $lecStmt = $db->prepare("SELECT id, title, description, video_url, duration, sort_order, is_preview, video_type, video_id 
                             FROM lectures 
                             WHERE module_id = ? 
                             ORDER BY sort_order ASC");

    $courseModules = [];
    while ($mod = $modStmt->fetch(PDO::FETCH_ASSOC)) {
        $mod['id'] = (int)$mod['id'];
        $mod['sort_order'] = (int)$mod['sort_order'];
        
        $lecStmt->execute([$mod['id']]);
        $lectures = [];
        while ($lec = $lecStmt->fetch(PDO::FETCH_ASSOC)) {
            $lec['id'] = (int)$lec['id'];
            $lec['sort_order'] = (int)$lec['sort_order'];
            $lec['is_preview'] = (int)$lec['is_preview'] === 1;
            $lectures[] = $lec;
        }
        $mod['lectures'] = $lectures;
        $courseModules[] = $mod;
    }
    $updatedCourse['modules'] = $courseModules;
    unset($updatedCourse['curriculum']);
    
    if (isset($updatedCourse['price'])) {
        $updatedCourse['price'] = (float)$updatedCourse['price'];
    }
    
    sendResponse(200, $updatedCourse, "Course updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
