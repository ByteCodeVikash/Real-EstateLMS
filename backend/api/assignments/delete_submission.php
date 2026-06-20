<?php
/**
 * DELETE /api/assignments/{id}/submit
 * Delete an existing assignment submission and remove its file from disk
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
    $db = Database::getConnection();
    
    // 2. Fetch the assignment details to verify existence
    $assignment = Assignment::findById($assignmentId);
    if (!$assignment) {
        sendResponse(404, null, "Assignment not found.");
    }
    
    // 3. Fetch current submission
    $stmt = $db->prepare("SELECT id, file_path, status FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?");
    $stmt->execute([$assignmentId, $user['id']]);
    $submission = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$submission) {
        sendResponse(404, null, "No submission found to delete.");
    }
    
    // Graded assignments cannot be deleted/withdrawn
    if ($submission['status'] === 'Graded') {
        sendResponse(400, null, "Submission cannot be removed because it has already been graded.");
    }
    
    // 4. Delete the physical file
    if (!empty($submission['file_path'])) {
        $filePath = __DIR__ . '/../../' . ltrim($submission['file_path'], '/');
        if (file_exists($filePath) && is_file($filePath)) {
            @unlink($filePath);
        }
    }
    
    // 5. Delete database record
    $stmtDelete = $db->prepare("DELETE FROM assignment_submissions WHERE id = ?");
    $stmtDelete->execute([$submission['id']]);
    
    sendResponse(200, null, "Submission removed successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
