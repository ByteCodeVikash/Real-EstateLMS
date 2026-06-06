<?php
/**
 * Assignment Model for RealEstate LMS
 */

require_once __DIR__ . '/../config/db.php';

class Assignment {
    
    /**
     * Create a new assignment
     * 
     * @param array $data
     * @return int The newly created assignment ID
     * @throws PDOException
     */
    public static function create(array $data): int {
        $db = Database::getConnection();
        
        $sql = "INSERT INTO assignments (course_id, module_id, title, description, instructions, due_date, max_marks, status, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            (int)$data['course_id'],
            isset($data['module_id']) && $data['module_id'] !== null ? (int)$data['module_id'] : null,
            trim(strip_tags((string)$data['title'])),
            isset($data['description']) ? trim(strip_tags((string)$data['description'])) : null,
            isset($data['instructions']) ? trim(strip_tags((string)$data['instructions'])) : null,
            isset($data['due_date']) && !empty($data['due_date']) ? trim((string)$data['due_date']) : null,
            isset($data['max_marks']) ? (int)$data['max_marks'] : 100,
            isset($data['status']) ? trim((string)$data['status']) : 'Draft',
            (int)$data['created_by']
        ]);
        
        return (int)$db->lastInsertId();
    }
    
    /**
     * Update an existing assignment
     * 
     * @param int $id
     * @param array $data
     * @return bool True on success, false on failure
     * @throws PDOException
     */
    public static function update(int $id, array $data): bool {
        $db = Database::getConnection();
        
        // Fetch existing assignment to keep old values if not provided
        $existing = self::findById($id);
        if (!$existing) {
            return false;
        }
        
        $sql = "UPDATE assignments 
                SET course_id = ?, module_id = ?, title = ?, description = ?, instructions = ?, due_date = ?, max_marks = ?, status = ?
                WHERE id = ?";
        
        $stmt = $db->prepare($sql);
        return $stmt->execute([
            isset($data['course_id']) ? (int)$data['course_id'] : (int)$existing['course_id'],
            array_key_exists('module_id', $data) ? ($data['module_id'] !== null ? (int)$data['module_id'] : null) : $existing['module_id'],
            isset($data['title']) ? trim(strip_tags((string)$data['title'])) : $existing['title'],
            array_key_exists('description', $data) ? (trim(strip_tags((string)$data['description'])) ?: null) : $existing['description'],
            array_key_exists('instructions', $data) ? (trim(strip_tags((string)$data['instructions'])) ?: null) : $existing['instructions'],
            array_key_exists('due_date', $data) ? (trim((string)$data['due_date']) ?: null) : $existing['due_date'],
            isset($data['max_marks']) ? (int)$data['max_marks'] : (int)$existing['max_marks'],
            isset($data['status']) ? trim((string)$data['status']) : $existing['status'],
            $id
        ]);
    }
    
    /**
     * Delete an assignment
     * 
     * @param int $id
     * @return bool True on success
     * @throws PDOException
     */
    public static function delete(int $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM assignments WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    /**
     * Find assignment by ID
     * 
     * @param int $id
     * @return array|null
     * @throws PDOException
     */
    public static function findById(int $id): ?array {
        $db = Database::getConnection();
        $sql = "SELECT a.*, c.title AS course_title, m.title AS module_title, u.full_name AS creator_name
                FROM assignments a
                INNER JOIN courses c ON a.course_id = c.id
                LEFT JOIN course_modules m ON a.module_id = m.id
                INNER JOIN users u ON a.created_by = u.id
                WHERE a.id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            $result['id'] = (int)$result['id'];
            $result['course_id'] = (int)$result['course_id'];
            $result['module_id'] = $result['module_id'] !== null ? (int)$result['module_id'] : null;
            $result['max_marks'] = (int)$result['max_marks'];
            $result['created_by'] = (int)$result['created_by'];
            return $result;
        }
        
        return null;
    }
    
    /**
     * Get all assignments for a course
     * 
     * @param int $courseId
     * @param string|null $statusFilter If provided, filters by status ('Draft', 'Published', 'Archived')
     * @return array
     * @throws PDOException
     */
    public static function findByCourse(int $courseId, ?string $statusFilter = null): array {
        $db = Database::getConnection();
        
        $sql = "SELECT a.*, m.title AS module_title 
                FROM assignments a 
                LEFT JOIN course_modules m ON a.module_id = m.id 
                WHERE a.course_id = ?";
        
        $params = [$courseId];
        if ($statusFilter !== null) {
            $sql .= " AND a.status = ?";
            $params[] = $statusFilter;
        }
        
        $sql .= " ORDER BY a.created_at DESC";
        
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($results as &$r) {
            $r['id'] = (int)$r['id'];
            $r['course_id'] = (int)$r['course_id'];
            $r['module_id'] = $r['module_id'] !== null ? (int)$r['module_id'] : null;
            $r['max_marks'] = (int)$r['max_marks'];
            $r['created_by'] = (int)$r['created_by'];
        }
        
        return $results;
    }
    
    /**
     * Check if a user has access to perform an action on an assignment
     * 
     * @param array $user Authenticated user details
     * @param int|null $assignmentId ID of the target assignment (null for creation action)
     * @param string $action Action: 'create', 'read', 'update', 'delete'
     * @param int|null $courseId The course ID (needed for 'create' action checks)
     * @return bool True if permitted, false otherwise
     */
    public static function hasAccess(array $user, ?int $assignmentId, string $action, ?int $courseId = null): bool {
        // 1. Admin & Super Admin have full access to everything
        if (isset($user['role']) && in_array($user['role'], ['super_admin', 'admin'])) {
            return true;
        }
        
        $db = Database::getConnection();
        
        // 2. Instructor Access Control
        if (isset($user['role']) && $user['role'] === 'instructor') {
            if ($action === 'create') {
                if (!$courseId) {
                    return false;
                }
                // Verify the instructor owns/created the course
                $stmt = $db->prepare("SELECT created_by FROM courses WHERE id = ?");
                $stmt->execute([$courseId]);
                $courseCreator = $stmt->fetchColumn();
                return $courseCreator !== false && (int)$courseCreator === (int)$user['id'];
            } else {
                if (!$assignmentId) {
                    return false;
                }
                // Verify the instructor owns/created the course associated with this assignment
                $stmt = $db->prepare("SELECT c.created_by 
                                      FROM assignments a 
                                      INNER JOIN courses c ON a.course_id = c.id 
                                      WHERE a.id = ?");
                $stmt->execute([$assignmentId]);
                $courseCreator = $stmt->fetchColumn();
                return $courseCreator !== false && (int)$courseCreator === (int)$user['id'];
            }
        }
        
        // 3. Student Access Control
        if (isset($user['role']) && $user['role'] === 'student') {
            // Students can only perform read actions
            if ($action !== 'read' || !$assignmentId) {
                return false;
            }
            
            // Check if the assignment is Published
            $stmt = $db->prepare("SELECT course_id, status FROM assignments WHERE id = ?");
            $stmt->execute([$assignmentId]);
            $assignment = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$assignment || $assignment['status'] !== 'Published') {
                return false;
            }
            
            // Check if student is active/enrolled in the course
            $stmtEnroll = $db->prepare("SELECT id FROM enrollments 
                                        WHERE user_id = ? AND course_id = ? AND completion_status = 'Active'");
            $stmtEnroll->execute([(int)$user['id'], (int)$assignment['course_id']]);
            return $stmtEnroll->fetch() !== false;
        }
        
        return false;
    }
}
