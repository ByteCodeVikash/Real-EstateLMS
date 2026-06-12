<?php
/**
 * GET /api/enrollments
 * List enrollments with filtering and pagination
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Requires authentication
$currentUser = requireAuth();

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
if ($page < 1) $page = 1;
if ($limit < 1) $limit = 10;
$offset = ($page - 1) * $limit;

$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
$status = isset($_GET['status']) ? trim($_GET['status']) : '';

try {
    $db = Database::getConnection();
    
    $conditions = [];
    $params = [];
    
    // Authorization & Visibility Filter
    if ($currentUser['role'] === 'student') {
        // Students can only view their own enrollments
        $conditions[] = "e.user_id = ?";
        $params[] = $currentUser['id'];
        
        // If student specified a user_id, verify it matches themselves
        if ($userId > 0 && $userId !== (int)$currentUser['id']) {
            sendResponse(403, null, "Forbidden: Students can only view their own enrollments.");
        }
    } else if ($currentUser['role'] === 'instructor') {
        // Instructors can only view enrollments in courses they created
        $conditions[] = "c.created_by = ?";
        $params[] = $currentUser['id'];
        
        if ($userId > 0) {
            $conditions[] = "e.user_id = ?";
            $params[] = $userId;
        }
    } else {
        // Admins/Super Admins can view everything
        if ($userId > 0) {
            $conditions[] = "e.user_id = ?";
            $params[] = $userId;
        }
    }
    
    // Course ID filter
    if ($courseId > 0) {
        $conditions[] = "e.course_id = ?";
        $params[] = $courseId;
    }
    
    // Status filter
    if (!empty($status)) {
        $conditions[] = "(e.status = ? OR e.completion_status = ?)";
        $params[] = $status;
        $params[] = $status;
    }
    
    $whereClause = "";
    if (count($conditions) > 0) {
        $whereClause = "WHERE " . implode(" AND ", $conditions);
    }
    
    // Count total items
    $countSql = "SELECT COUNT(DISTINCT e.id) 
                 FROM enrollments e 
                 JOIN courses c ON e.course_id = c.id
                 $whereClause";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $totalItems = (int)$countStmt->fetchColumn();
    
    // Fetch enrollments with pagination
    $sql = "SELECT 
                e.id,
                e.user_id,
                e.course_id,
                e.status,
                e.enrolled_at,
                e.completed_at,
                e.enrollment_date,
                e.progress,
                e.created_at,
                e.updated_at,
                e.completion_status,
                e.certificate_issued,
                c.title AS course_title,
                c.slug AS course_slug,
                c.created_by AS course_creator_id,
                u.full_name AS student_name,
                u.email AS student_email
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            JOIN users u ON e.user_id = u.id
            $whereClause
            ORDER BY e.created_at DESC
            LIMIT ? OFFSET ?";
            
    $stmt = $db->prepare($sql);
    
    $paramIndex = 1;
    foreach ($params as $param) {
        $stmt->bindValue($paramIndex++, $param);
    }
    $stmt->bindValue($paramIndex++, $limit, PDO::PARAM_INT);
    $stmt->bindValue($paramIndex++, $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $enrollments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Cast values
    foreach ($enrollments as &$e) {
        $e['id'] = (int)$e['id'];
        $e['user_id'] = (int)$e['user_id'];
        $e['course_id'] = (int)$e['course_id'];
        $e['progress'] = (int)$e['progress'];
        $e['certificate_issued'] = (int)$e['certificate_issued'];
        $e['course_creator_id'] = (int)$e['course_creator_id'];
    }
    
    $totalPages = ceil($totalItems / $limit);
    
    sendResponse(200, [
        'enrollments' => $enrollments,
        'pagination' => [
            'total_items' => $totalItems,
            'total_pages' => $totalPages,
            'current_page' => $page,
            'limit' => $limit
        ]
    ], "Enrollments retrieved successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
