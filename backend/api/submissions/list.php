<?php
/**
 * GET /api/submissions
 * Retrieve all student submissions (filtered by ownership for instructors)
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// 1. Authenticate user
$user = requireAuth();

// 2. Validate user role (Admin or Instructor)
if (!isset($user['role']) || !in_array($user['role'], ['super_admin', 'admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators and instructors can view submissions.");
}

try {
    $db = Database::getConnection();
    
    $sql = "SELECT s.*, 
                   a.title AS assignment_title, a.max_marks,
                   c.title AS course_title, c.created_by AS course_creator,
                   student.full_name AS student_name, student.email AS student_email,
                   grader.full_name AS grader_name
            FROM assignment_submissions s
            INNER JOIN assignments a ON s.assignment_id = a.id
            INNER JOIN courses c ON a.course_id = c.id
            INNER JOIN users student ON s.student_id = student.id
            LEFT JOIN users grader ON s.graded_by = grader.id";
            
    if ($user['role'] === 'instructor') {
        $sql .= " WHERE c.created_by = ? ORDER BY s.submitted_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$user['id']]);
    } else {
        $sql .= " ORDER BY s.submitted_at DESC";
        $stmt = $db->query($sql);
    }
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($results as &$r) {
        $r['id'] = (int)$r['id'];
        $r['assignment_id'] = (int)$r['assignment_id'];
        $r['student_id'] = (int)$r['student_id'];
        $r['max_marks'] = (int)$r['max_marks'];
        $r['marks'] = $r['marks'] !== null ? (int)$r['marks'] : null;
        $r['graded_by'] = $r['graded_by'] !== null ? (int)$r['graded_by'] : null;
    }
    
    sendResponse(200, $results, "Submissions retrieved successfully.");

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
