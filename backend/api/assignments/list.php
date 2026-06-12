<?php
/**
 * GET /api/assignments
 * List all assignments with role-based visibility and pagination
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// 1. Authenticate user
$user = requireAuth();

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
if ($page < 1) $page = 1;
if ($limit < 1) $limit = 10;
if ($limit > 100) $limit = 100; // Cap limit at 100 to prevent DoS
$offset = ($page - 1) * $limit;

$courseIdFilter = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
$statusFilter = isset($_GET['status']) ? trim((string)$_GET['status']) : '';
$searchFilter = isset($_GET['search']) ? trim((string)$_GET['search']) : '';

try {
    $db = Database::getConnection();
    
    $conditions = [];
    $params = [];
    $countJoins = "";
    $selectJoins = "";
    
    // 2. Role-based visibility logic
    if ($user['role'] === 'student') {
        // Students only see published assignments in courses they are enrolled in
        $enrollJoin = " INNER JOIN enrollments e ON a.course_id = e.course_id AND e.user_id = ? AND e.completion_status = 'Active'";
        $countJoins = $enrollJoin;
        $selectJoins = $enrollJoin;
        $params[] = $user['id'];
        
        $conditions[] = "a.status = 'Published'";
    } else if ($user['role'] === 'instructor') {
        // Instructors only see assignments for courses they created/own
        $conditions[] = "c.created_by = ?";
        $params[] = $user['id'];
    } else {
        // Admins can see everything
    }
    
    // 3. Optional course filter
    if ($courseIdFilter > 0) {
        $conditions[] = "a.course_id = ?";
        $params[] = $courseIdFilter;
    }

    // 4. Optional status filter
    if ($statusFilter !== '') {
        if ($user['role'] === 'student') {
            // Students can only see Published assignments. If they filter by something else, they see nothing.
            if (strtolower($statusFilter) === 'published') {
                // Already handled by role-based logic
            } else {
                $conditions[] = "1=0"; // Force empty result securely
            }
        } else {
            // Admin/Instructor can filter by status
            $validStatuses = ['Draft', 'Published', 'Archived'];
            $matchedStatus = null;
            foreach ($validStatuses as $vs) {
                if (strcasecmp($vs, $statusFilter) === 0) {
                    $matchedStatus = $vs;
                    break;
                }
            }
            if ($matchedStatus !== null) {
                $conditions[] = "a.status = ?";
                $params[] = $matchedStatus;
            } else {
                $conditions[] = "1=0"; // Force empty result securely for invalid status
            }
        }
    }

    // 5. Optional search filter
    if ($searchFilter !== '') {
        $conditions[] = "a.title LIKE ?";
        $params[] = "%{$searchFilter}%";
    }
    
    // Combine conditions
    $whereClause = "";
    if (count($conditions) > 0) {
        $whereClause = "WHERE " . implode(" AND ", $conditions);
    }
    
    // 4. Count total items
    $countSql = "SELECT COUNT(DISTINCT a.id) 
                 FROM assignments a 
                 INNER JOIN courses c ON a.course_id = c.id
                 $countJoins 
                 $whereClause";
    $stmtCount = $db->prepare($countSql);
    $stmtCount->execute($params);
    $totalItems = (int)$stmtCount->fetchColumn();
    
    // 5. Fetch assignments page
    $sql = "SELECT DISTINCT a.*, c.title AS course_title, m.title AS module_title, u.full_name AS creator_name
            FROM assignments a
            INNER JOIN courses c ON a.course_id = c.id
            LEFT JOIN course_modules m ON a.module_id = m.id
            INNER JOIN users u ON a.created_by = u.id
            $selectJoins
            $whereClause
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?";
            
    $stmt = $db->prepare($sql);
    
    // Bind all parameter values
    $paramIndex = 1;
    foreach ($params as $param) {
        $stmt->bindValue($paramIndex++, $param);
    }
    $stmt->bindValue($paramIndex++, $limit, PDO::PARAM_INT);
    $stmt->bindValue($paramIndex++, $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Map data types properly
    foreach ($assignments as &$a) {
        $a['id'] = (int)$a['id'];
        $a['course_id'] = (int)$a['course_id'];
        $a['module_id'] = $a['module_id'] !== null ? (int)$a['module_id'] : null;
        $a['max_marks'] = (int)$a['max_marks'];
        $a['created_by'] = (int)$a['created_by'];
    }
    
    $totalPages = ceil($totalItems / $limit);
    
    sendResponse(200, [
        'assignments' => $assignments,
        'pagination' => [
            'total_items' => $totalItems,
            'total_pages' => $totalPages,
            'current_page' => $page,
            'limit' => $limit
        ]
    ], "Assignments retrieved successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
