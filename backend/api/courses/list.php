<?php
/**
 * GET /api/courses
 * List all courses with pagination, search, and filtering
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Authenticate user optionally
$user = null;
$token = getBearerToken();
if ($token) {
    $user = requireAuth();
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
if ($page < 1) $page = 1;
if ($limit < 1) $limit = 10;
$offset = ($page - 1) * $limit;

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
$status = isset($_GET['status']) ? trim($_GET['status']) : '';

try {
    $db = Database::getConnection();
    
    // Construct Query conditions
    $conditions = [];
    $params = [];
    
    // 1. Role-based visibility logic
    if ($user && $user['role'] === 'student') {
        // Students can only view Published courses
        $conditions[] = "c.status = 'Published'";
    } else if ($user && $user['role'] === 'instructor') {
        // Instructors can view all published courses OR their own draft/archived courses
        $conditions[] = "(c.created_by = ? OR c.status = 'Published')";
        $params[] = $user['id'];
        
        if (!empty($status)) {
            $conditions[] = "c.status = ?";
            $params[] = $status;
        }
    } else if ($user) {
        // Admins can see everything, apply status filter if specified
        if (!empty($status)) {
            $conditions[] = "c.status = ?";
            $params[] = $status;
        }
    } else {
        // Guests can only view Published courses
        $conditions[] = "c.status = 'Published'";
    }
    
    // 2. Search filter
    if (!empty($search)) {
        $conditions[] = "(c.title LIKE ? OR c.description LIKE ? OR c.mentor_name LIKE ?)";
        $searchParam = "%{$search}%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    // 3. Category filter
    if ($categoryId > 0) {
        $conditions[] = "c.category_id = ?";
        $params[] = $categoryId;
    }
    
    // Combine conditions
    $whereClause = "";
    if (count($conditions) > 0) {
        $whereClause = "WHERE " . implode(" AND ", $conditions);
    }
    
    // Count total items matching the conditions
    $countSql = "SELECT COUNT(*) FROM courses c $whereClause";
    $stmtCount = $db->prepare($countSql);
    $stmtCount->execute($params);
    $totalItems = (int)$stmtCount->fetchColumn();
    
    // Fetch courses page
    $sql = "SELECT c.*, cat.name as category_name 
            FROM courses c 
            LEFT JOIN categories cat ON c.category_id = cat.id 
            $whereClause 
            ORDER BY c.created_at DESC 
            LIMIT ? OFFSET ?";
            
    $stmt = $db->prepare($sql);
    
    // Execute with binding parameters properly for pagination limits
    $paramIndex = 1;
    foreach ($params as $param) {
        $stmt->bindValue($paramIndex++, $param);
    }
    $stmt->bindValue($paramIndex++, $limit, PDO::PARAM_INT);
    $stmt->bindValue($paramIndex++, $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get list of enrolled course IDs if student
    $enrolledCourseIds = [];
    if ($user && $user['role'] === 'student') {
        $enrollStmt = $db->prepare("SELECT course_id FROM enrollments WHERE user_id = ?");
        $enrollStmt->execute([$user['id']]);
        $enrolledCourseIds = $enrollStmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
    }

    // Fetch modules from course_modules table for each course
    $modStmt = $db->prepare("SELECT id, title, description, sort_order 
                             FROM course_modules 
                             WHERE course_id = ? 
                             ORDER BY sort_order ASC");
                             
    $lecStmt = $db->prepare("SELECT id, title, description, video_url, duration, sort_order, is_preview, video_type, video_id 
                             FROM lectures 
                             WHERE module_id = ? 
                             ORDER BY sort_order ASC");

    foreach ($courses as &$c) {
        $isEnrolled = in_array($c['id'], $enrolledCourseIds);
        $modStmt->execute([$c['id']]);
        $modules = [];
        while ($mod = $modStmt->fetch(PDO::FETCH_ASSOC)) {
            $mod['id'] = (int)$mod['id'];
            $mod['sort_order'] = (int)$mod['sort_order'];
            
            $lecStmt->execute([$mod['id']]);
            $lectures = [];
            while ($lec = $lecStmt->fetch(PDO::FETCH_ASSOC)) {
                $lec['id'] = (int)$lec['id'];
                $lec['sort_order'] = (int)$lec['sort_order'];
                $lec['is_preview'] = (int)$lec['is_preview'] === 1;

                if ((!$user || $user['role'] === 'student') && !$isEnrolled && !$lec['is_preview']) {
                    $lec['video_url'] = null;
                    $lec['video_id'] = null;
                }
                $lectures[] = $lec;
            }
            $mod['lectures'] = $lectures;
            $modules[] = $mod;
        }
        $c['modules'] = $modules;
        unset($c['curriculum']); // remove raw text
        if (isset($c['price'])) {
            $c['price'] = (float)$c['price'];
        }
    }
    
    $totalPages = ceil($totalItems / $limit);
    
    sendResponse(200, [
        'courses' => $courses,
        'pagination' => [
            'total_items' => $totalItems,
            'total_pages' => $totalPages,
            'current_page' => $page,
            'limit' => $limit
        ]
    ], "Courses retrieved successfully.");
    
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
