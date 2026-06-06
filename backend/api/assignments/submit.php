<?php
/**
 * POST /api/assignments/{id}/submit
 * Submit/replace an assignment file before the deadline
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Assignment.php';
require_once __DIR__ . '/../../models/AssignmentSubmission.php';

// 1. Authenticate user
$user = requireAuth();

$assignmentId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($assignmentId <= 0) {
    sendResponse(400, null, "Invalid assignment ID.");
}

try {
    // 2. Fetch the assignment details
    $assignment = Assignment::findById($assignmentId);
    if (!$assignment) {
        sendResponse(404, null, "Assignment not found.");
    }
    
    // 3. Check submission access (active student enrollment & published status)
    if (!AssignmentSubmission::hasAccess($user, null, 'submit', $assignmentId)) {
        sendResponse(403, null, "Forbidden: You are not enrolled in the course associated with this assignment or it is unpublished.");
    }
    
    // 4. Check deadline
    if (!empty($assignment['due_date'])) {
        $now = time();
        $due = strtotime($assignment['due_date']);
        if ($now > $due) {
            sendResponse(400, null, "Submission rejected: The deadline has passed.");
        }
    }
    
    // 5. Secure File Upload validation
    if (!isset($_FILES['file'])) {
        if (isset($_FILES['submission'])) {
            $_FILES['file'] = $_FILES['submission'];
        } else {
            sendResponse(400, null, "No file uploaded. Please supply a multipart form field named 'file'.");
        }
    }
    
    $fileError = $_FILES['file']['error'];
    if ($fileError !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE   => 'The uploaded file exceeds the upload_max_filesize directive in php.ini.',
            UPLOAD_ERR_FORM_SIZE  => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.',
            UPLOAD_ERR_PARTIAL    => 'The uploaded file was only partially uploaded.',
            UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder.',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
            UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload.'
        ];
        sendResponse(400, null, $uploadErrors[$fileError] ?? "File upload error.");
    }
    
    // Validate File Size (15MB Limit)
    $maxSize = 15 * 1024 * 1024; // 15MB
    if ($_FILES['file']['size'] > $maxSize) {
        sendResponse(400, null, "File is too large. Maximum file size is 15MB.");
    }
    
    // Validate Extension and prevent double-extension/path traversal attacks
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
    
    $allowedExtensions = ['pdf', 'docx', 'xlsx', 'zip'];
    if (!in_array($extension, $allowedExtensions)) {
        sendResponse(400, null, "Unsupported file extension. Allowed formats: PDF, DOCX, XLSX, ZIP.");
    }
    
    // Clean up old replacement files if any exist
    $db = Database::getConnection();
    $stmtExist = $db->prepare("SELECT file_path FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?");
    $stmtExist->execute([$assignmentId, $user['id']]);
    $existingPath = $stmtExist->fetchColumn();
    
    if ($existingPath) {
        $oldFilePath = __DIR__ . '/../../' . ltrim($existingPath, '/');
        if (file_exists($oldFilePath) && is_file($oldFilePath)) {
            @unlink($oldFilePath);
        }
    }
    
    // Write out new unique secure filename
    $uploadDir = __DIR__ . '/../../uploads/assignments/';
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0755, true);
    }
    
    $uniqueName = 'student_' . $user['id'] . '_assign_' . $assignmentId . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
    $destPath = $uploadDir . $uniqueName;
    
    if (!move_uploaded_file($_FILES['file']['tmp_name'], $destPath)) {
        sendResponse(500, null, "Upload failed: Failed to persist file on disk.");
    }
    
    $fileWebPath = '/uploads/assignments/' . $uniqueName;
    
    // Save record to DB
    $subId = AssignmentSubmission::submit([
        'assignment_id' => $assignmentId,
        'student_id' => $user['id'],
        'file_path' => $fileWebPath
    ]);
    
    $submission = AssignmentSubmission::findById($subId);
    sendResponse(201, $submission, "Assignment submitted successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
