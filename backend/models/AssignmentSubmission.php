<?php
/**
 * AssignmentSubmission Model for RealEstate LMS
 */

require_once __DIR__ . '/../config/db.php';

class AssignmentSubmission {
    
    /**
     * Submit an assignment
     * 
     * @param array $data
     * @return int The newly created submission ID
     * @throws PDOException
     */
    public static function submit(array $data): int {
        $db = Database::getConnection();
        
        $sql = "INSERT INTO assignment_submissions (assignment_id, student_id, file_path, status, submitted_at) 
                VALUES (?, ?, ?, 'Submitted', CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE file_path = VALUES(file_path), status = 'Submitted', submitted_at = CURRENT_TIMESTAMP, marks = NULL, feedback = NULL, graded_by = NULL, graded_at = NULL";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            (int)$data['assignment_id'],
            (int)$data['student_id'],
            trim((string)$data['file_path'])
        ]);
        
        return (int)$db->lastInsertId();
    }
    
    /**
     * Grade a submission
     * 
     * @param int $submissionId
     * @param int $graderId
     * @param int $marks
     * @param string|null $feedback
     * @param string $status 'Submitted', 'Under Review', 'Graded', or 'Revision Requested'
     * @return bool True on success
     * @throws PDOException
     */
    public static function grade(int $submissionId, int $graderId, int $marks, ?string $feedback = null, string $status = 'Graded'): bool {
        $db = Database::getConnection();
        
        $sql = "UPDATE assignment_submissions 
                SET marks = ?, feedback = ?, status = ?, graded_by = ?, graded_at = CURRENT_TIMESTAMP 
                WHERE id = ?";
        
        $stmt = $db->prepare($sql);
        return $stmt->execute([
            $status !== 'Graded' ? null : (int)$marks,
            $feedback !== null ? trim(strip_tags($feedback)) : null,
            $status,
            (int)$graderId,
            $submissionId
        ]);
    }

    /**
     * Find submissions for a specific course
     * 
     * @param int $courseId
     * @return array
     * @throws PDOException
     */
    public static function findByCourse(int $courseId): array {
        $db = Database::getConnection();
        $sql = "SELECT s.*, 
                       a.title AS assignment_title, a.max_marks,
                       c.title AS course_title,
                       student.full_name AS student_name, student.email AS student_email,
                       grader.full_name AS grader_name
                FROM assignment_submissions s
                INNER JOIN assignments a ON s.assignment_id = a.id
                INNER JOIN courses c ON a.course_id = c.id
                INNER JOIN users student ON s.student_id = student.id
                LEFT JOIN users grader ON s.graded_by = grader.id
                WHERE a.course_id = ?
                ORDER BY s.submitted_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$courseId]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($results as &$r) {
            $r['id'] = (int)$r['id'];
            $r['assignment_id'] = (int)$r['assignment_id'];
            $r['student_id'] = (int)$r['student_id'];
            $r['max_marks'] = (int)$r['max_marks'];
            $r['marks'] = $r['marks'] !== null ? (int)$r['marks'] : null;
            $r['graded_by'] = $r['graded_by'] !== null ? (int)$r['graded_by'] : null;
        }
        
        return $results;
    }
    
    /**
     * Find submission by ID
     * 
     * @param int $id
     * @return array|null
     * @throws PDOException
     */
    public static function findById(int $id): ?array {
        $db = Database::getConnection();
        $sql = "SELECT s.*, 
                       a.title AS assignment_title, a.course_id, a.max_marks,
                       c.title AS course_title,
                       student.full_name AS student_name, student.email AS student_email,
                       grader.full_name AS grader_name
                FROM assignment_submissions s
                INNER JOIN assignments a ON s.assignment_id = a.id
                INNER JOIN courses c ON a.course_id = c.id
                INNER JOIN users student ON s.student_id = student.id
                LEFT JOIN users grader ON s.graded_by = grader.id
                WHERE s.id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            $result['id'] = (int)$result['id'];
            $result['assignment_id'] = (int)$result['assignment_id'];
            $result['student_id'] = (int)$result['student_id'];
            $result['course_id'] = (int)$result['course_id'];
            $result['max_marks'] = (int)$result['max_marks'];
            $result['marks'] = $result['marks'] !== null ? (int)$result['marks'] : null;
            $result['graded_by'] = $result['graded_by'] !== null ? (int)$result['graded_by'] : null;
            return $result;
        }
        
        return null;
    }
    
    /**
     * Find submissions for a specific assignment
     * 
     * @param int $assignmentId
     * @return array
     * @throws PDOException
     */
    public static function findByAssignment(int $assignmentId): array {
        $db = Database::getConnection();
        $sql = "SELECT s.*, u.full_name AS student_name, u.email AS student_email
                FROM assignment_submissions s
                INNER JOIN users u ON s.student_id = u.id
                WHERE s.assignment_id = ?
                ORDER BY s.submitted_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$assignmentId]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($results as &$r) {
            $r['id'] = (int)$r['id'];
            $r['assignment_id'] = (int)$r['assignment_id'];
            $r['student_id'] = (int)$r['student_id'];
            $r['marks'] = $r['marks'] !== null ? (int)$r['marks'] : null;
            $r['graded_by'] = $r['graded_by'] !== null ? (int)$r['graded_by'] : null;
        }
        
        return $results;
    }
    
    /**
     * Find submissions by student ID
     * 
     * @param int $studentId
     * @return array
     * @throws PDOException
     */
    public static function findByStudent(int $studentId): array {
        $db = Database::getConnection();
        $sql = "SELECT s.*, a.title AS assignment_title, a.course_id, c.title AS course_title
                FROM assignment_submissions s
                INNER JOIN assignments a ON s.assignment_id = a.id
                INNER JOIN courses c ON a.course_id = c.id
                WHERE s.student_id = ?
                ORDER BY s.submitted_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$studentId]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($results as &$r) {
            $r['id'] = (int)$r['id'];
            $r['assignment_id'] = (int)$r['assignment_id'];
            $r['student_id'] = (int)$r['student_id'];
            $r['course_id'] = (int)$r['course_id'];
            $r['marks'] = $r['marks'] !== null ? (int)$r['marks'] : null;
            $r['graded_by'] = $r['graded_by'] !== null ? (int)$r['graded_by'] : null;
        }
        
        return $results;
    }
    
    /**
     * Check if a user has permission to perform an action on a submission
     * 
     * @param array $user Authenticated user details
     * @param int|null $submissionId ID of the target submission
     * @param string $action Action: 'submit', 'read', 'grade'
     * @param int|null $assignmentId ID of the parent assignment (required for 'submit' action check)
     * @return bool True if permitted, false otherwise
     */
    public static function hasAccess(array $user, ?int $submissionId, string $action, ?int $assignmentId = null): bool {
        // 1. Admin & Super Admin have full access
        if (isset($user['role']) && in_array($user['role'], ['super_admin', 'admin'])) {
            return true;
        }
        
        $db = Database::getConnection();
        
        // 2. Instructor Access Control
        if (isset($user['role']) && $user['role'] === 'instructor') {
            if ($action === 'submit') {
                return false; // Instructors don't submit assignments
            }
            
            if (!$submissionId) {
                return false;
            }
            
            // Instructors can view/grade submissions only for assignments of courses they manage
            $sql = "SELECT c.created_by 
                    FROM assignment_submissions s
                    INNER JOIN assignments a ON s.assignment_id = a.id
                    INNER JOIN courses c ON a.course_id = c.id
                    WHERE s.id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$submissionId]);
            $courseCreator = $stmt->fetchColumn();
            return $courseCreator !== false && (int)$courseCreator === (int)$user['id'];
        }
        
        // 3. Student Access Control
        if (isset($user['role']) && $user['role'] === 'student') {
            if ($action === 'grade') {
                return false; // Students cannot grade submissions
            }
            
            if ($action === 'submit') {
                if (!$assignmentId) {
                    return false;
                }
                
                // Student can only submit if enrolled in the course associated with the assignment
                $sql = "SELECT course_id, status FROM assignments WHERE id = ?";
                $stmt = $db->prepare($sql);
                $stmt->execute([$assignmentId]);
                $assignment = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$assignment || $assignment['status'] !== 'Published') {
                    return false;
                }
                
                $stmtEnroll = $db->prepare("SELECT id FROM enrollments 
                                            WHERE user_id = ? AND course_id = ? AND completion_status = 'Active'");
                $stmtEnroll->execute([(int)$user['id'], (int)$assignment['course_id']]);
                return $stmtEnroll->fetch() !== false;
            }
            
            if ($action === 'read') {
                if (!$submissionId) {
                    return false;
                }
                
                // Student can only read their own submissions
                $stmt = $db->prepare("SELECT student_id FROM assignment_submissions WHERE id = ?");
                $stmt->execute([$submissionId]);
                $subStudentId = $stmt->fetchColumn();
                return $subStudentId !== false && (int)$subStudentId === (int)$user['id'];
            }
        }
        
        return false;
    }
}
