<?php
/**
 * POST /api/submissions/{id}/grade
 * Allow administrators and instructors to grade and update the status of submissions
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validation.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/AssignmentSubmission.php';

// 1. Authenticate user
$user = requireAuth();

// 2. Validate user role (Admin or Instructor)
if (!isset($user['role']) || !in_array($user['role'], ['super_admin', 'admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators and instructors can grade submissions.");
}

$submissionId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($submissionId <= 0) {
    sendResponse(400, null, "Invalid submission ID.");
}

try {
    // 3. Fetch submission to verify existence
    $submission = AssignmentSubmission::findById($submissionId);
    if (!$submission) {
        sendResponse(404, null, "Submission not found.");
    }

    // 4. Permission Check: Verify if instructor has access to this course's submissions
    if (!AssignmentSubmission::hasAccess($user, $submissionId, 'grade')) {
        sendResponse(403, null, "Forbidden: You are not authorized to grade this submission.");
    }

    // 5. Parse input payload
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    
    // Inject the grader ID
    $input['graded_by'] = $user['id'];

    // 6. Validate input data
    $errors = validateGrading($input, $submission['max_marks']);
    if (!empty($errors)) {
        sendResponse(422, ['errors' => $errors], "Validation failed.");
    }

    // 7. Update grading and status
    $marks = isset($input['marks']) && $input['status'] === 'Graded' ? (int)$input['marks'] : 0;
    $feedback = isset($input['feedback']) ? (string)$input['feedback'] : null;
    $status = trim((string)$input['status']);

    $success = AssignmentSubmission::grade($submissionId, $user['id'], $marks, $feedback, $status);

    if ($success) {
        $updatedSubmission = AssignmentSubmission::findById($submissionId);
        sendResponse(200, $updatedSubmission, "Submission graded successfully.");
    } else {
        sendResponse(500, null, "Failed to update submission grade.");
    }

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
