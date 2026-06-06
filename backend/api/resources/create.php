<?php
/**
 * POST /api/courses/{course_id}/resources
 * Add a new downloadable resource to a course
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

// Authorization: admin, super_admin, instructor only
if (!in_array($currentUser['role'], ['admin', 'super_admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators or instructors can add resources.");
}

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
if ($courseId <= 0) {
    sendResponse(400, null, "Validation Error: Valid course ID is required.");
}

// Check if course exists
try {
    $db = Database::getConnection();
    $cStmt = $db->prepare("SELECT id FROM courses WHERE id = ?");
    $cStmt->execute([$courseId]);
    if (!$cStmt->fetch()) {
        sendResponse(404, null, "Not Found: Course does not exist.");
    }
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}

$title = '';
$moduleId = null;
$filePath = '';
$fileType = '';
$fileSize = '';

// Check if content-type is multipart/form-data
$isMultipart = false;
$headers = getallheaders();
$contentType = $headers['Content-Type'] ?? $headers['content-type'] ?? $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'multipart/form-data') !== false) {
    $isMultipart = true;
}

if ($isMultipart) {
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $moduleId = isset($_POST['module_id']) && (int)$_POST['module_id'] > 0 ? (int)$_POST['module_id'] : null;
    
    // File upload logic
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        sendResponse(400, null, "Validation Error: No file uploaded or upload error occurred.");
    }
    
    $maxSize = 50 * 1024 * 1024; // 50MB
    if ($_FILES['file']['size'] > $maxSize) {
        sendResponse(400, null, "File is too large. Maximum file size is 50MB.");
    }
    
    $filename = basename($_FILES['file']['name']);
    $parts = explode('.', $filename);
    $extension = strtolower(end($parts));
    
    // Scan all parts of filename for malicious substrings
    foreach ($parts as $part) {
        $partExt = strtolower($part);
        if (in_array($partExt, ['php', 'exe', 'js', 'bat', 'sh', 'htaccess', 'pl', 'py'])) {
            sendResponse(400, null, "Security Violation: Blocked malicious file payload.");
        }
    }
    
    $allowedExtensions = ['pdf', 'docx', 'xlsx', 'zip', 'doc', 'mp4', 'png', 'jpg', 'jpeg'];
    if (!in_array($extension, $allowedExtensions)) {
        sendResponse(400, null, "Unsupported file extension. Allowed formats: PDF, DOCX, XLSX, ZIP, DOC, MP4, images.");
    }
    
    $uploadDir = __DIR__ . '/../../uploads/resources/';
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0755, true);
    }
    
    $uniqueName = 'res_course_' . $courseId . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
    $destPath = $uploadDir . $uniqueName;
    
    if (!move_uploaded_file($_FILES['file']['tmp_name'], $destPath)) {
        sendResponse(500, null, "Upload failed: Failed to persist file on disk.");
    }
    
    $filePath = '/uploads/resources/' . $uniqueName;
    $fileType = $extension;
    $fileSize = round($_FILES['file']['size'] / (1024 * 1024), 2) . ' MB';
} else {
    // Treat as JSON input
    $data = getRequestData();
    $title = isset($data['title']) ? trim($data['title']) : '';
    $moduleId = isset($data['module_id']) && (int)$data['module_id'] > 0 ? (int)$data['module_id'] : null;
    $filePath = isset($data['file_path']) ? trim($data['file_path']) : '';
    $fileType = isset($data['file_type']) ? trim($data['file_type']) : 'link';
    $fileSize = isset($data['file_size']) ? trim($data['file_size']) : 'N/A';
}

if (empty($title) || empty($filePath)) {
    sendResponse(400, null, "Validation Error: Title and file_path/file are required.");
}

try {
    $db = Database::getConnection();
    
    $stmt = $db->prepare("INSERT INTO course_resources (course_id, module_id, title, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$courseId, $moduleId, $title, $filePath, $fileType, $fileSize]);
    
    $newId = $db->lastInsertId();
    
    $getStmt = $db->prepare("
        SELECT r.*, m.title as module_title 
        FROM course_resources r
        LEFT JOIN course_modules m ON r.module_id = m.id
        WHERE r.id = ?
    ");
    $getStmt->execute([$newId]);
    $resource = $getStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($resource) {
        $resource['id'] = (int)$resource['id'];
        $resource['course_id'] = (int)$resource['course_id'];
        if ($resource['module_id'] !== null) {
            $resource['module_id'] = (int)$resource['module_id'];
        }
    }
    
    sendResponse(201, $resource, "Resource added successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
