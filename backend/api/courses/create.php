<?php
/**
 * POST /api/courses
 * Create a new course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user (Admins, Super Admins, and Instructors only)
$user = requireRole(['admin', 'super_admin', 'instructor']);

$data = getRequestData();

$categoryId = isset($data['category_id']) ? (int)$data['category_id'] : 0;
$title = trim(strip_tags($data['title'] ?? ''));
$description = trim(strip_tags($data['description'] ?? ''));
$thumbnail = trim(strip_tags($data['thumbnail'] ?? 'grad-blue'));
$mentorName = trim(strip_tags($data['mentor_name'] ?? ''));
$duration = trim(strip_tags($data['duration'] ?? '8 Weeks'));
$price = isset($data['price']) ? (float)$data['price'] : 0.00;
$status = trim(strip_tags($data['status'] ?? 'Draft'));
$modules = $data['modules'] ?? [];

// If mentorName is empty, default to current user's name
if (empty($mentorName)) {
    $mentorName = $user['full_name'];
}

// Validations
if (empty($title)) {
    sendResponse(400, null, "Validation Error: Course title is required.");
}

if ($categoryId <= 0) {
    sendResponse(400, null, "Validation Error: Category ID is required.");
}

if (!in_array($status, ['Draft', 'Published', 'Archived'])) {
    sendResponse(400, null, "Validation Error: Status must be 'Draft', 'Published', or 'Archived'.");
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

try {
    $db = Database::getConnection();
    
    // Verify Category exists
    $stmtCat = $db->prepare("SELECT id FROM categories WHERE id = ?");
    $stmtCat->execute([$categoryId]);
    if (!$stmtCat->fetch()) {
        sendResponse(400, null, "Validation Error: Referenced category does not exist.");
    }
    
    // Verify Slug uniqueness
    $stmtSlug = $db->prepare("SELECT id FROM courses WHERE slug = ?");
    $stmtSlug->execute([$slug]);
    if ($stmtSlug->fetch()) {
        sendResponse(409, null, "Conflict: A course with this slug already exists.");
    }
    
    // Serialize curriculum
    $curriculumJson = json_encode($modules);
    
    // Insert Course
    $sql = "INSERT INTO courses (category_id, title, slug, description, thumbnail, mentor_name, duration, price, status, created_by, curriculum) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        $user['id'],
        $curriculumJson
    ]);
    
    $newId = $db->lastInsertId();
    
    // Insert modules and lectures into database tables if provided
    if (!empty($modules) && is_array($modules)) {
        $insertMod = $db->prepare("INSERT INTO course_modules (course_id, title, description, sort_order) VALUES (?, ?, ?, ?)");
        $insertLec = $db->prepare("INSERT INTO lectures (module_id, title, description, video_url, duration, sort_order, is_preview, video_type, video_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $modSort = 1;
        foreach ($modules as $mod) {
            $modTitle = trim(strip_tags($mod['title'] ?? ''));
            if (empty($modTitle)) {
                $modTitle = "Untitled Section";
            }
            $modDesc = trim(strip_tags($mod['description'] ?? ''));
            $insertMod->execute([$newId, $modTitle, $modDesc, $modSort++]);
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
    
    // Return newly created course details
    $stmt = $db->prepare("SELECT c.*, cat.name as category_name 
                          FROM courses c 
                          LEFT JOIN categories cat ON c.category_id = cat.id 
                          WHERE c.id = ?");
    $stmt->execute([$newId]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Fetch modules from course_modules
    $modStmt = $db->prepare("SELECT id, title, description, sort_order 
                             FROM course_modules 
                             WHERE course_id = ? 
                             ORDER BY sort_order ASC");
    $modStmt->execute([$newId]);
    
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
    $course['modules'] = $courseModules;
    unset($course['curriculum']);
    
    if (isset($course['price'])) {
        $course['price'] = (float)$course['price'];
    }
    
    sendResponse(201, $course, "Course created successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
