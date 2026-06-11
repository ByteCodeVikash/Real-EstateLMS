<?php
/**
 * GET /api/lectures
 * List all lectures with filtering, sorting, pagination, and role-based visibility
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// 1. Authenticate user
$user = requireAuth();

// 2. Pagination parameters
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
if ($page < 1) $page = 1;
if ($limit < 1) $limit = 10;
if ($limit > 100) $limit = 100;
$offset = ($page - 1) * $limit;

// 3. Filtering parameters
$moduleIdFilter = isset($_GET['module_id']) ? (int)$_GET['module_id'] : 0;
$statusFilter = isset($_GET['status']) ? trim($_GET['status']) : '';

$allowedStatuses = ['Draft', 'Published', 'Archived'];
if ($statusFilter !== '' && !in_array($statusFilter, $allowedStatuses)) {
    sendResponse(400, null, "Validation Error: Invalid status. Allowed: Draft, Published, Archived.");
}

// Students are restricted to seeing Published lectures only
if ($user['role'] === 'student') {
    $statusFilter = 'Published';
}

// 4. Sorting parameters
$sortBy = isset($_GET['sort']) ? trim($_GET['sort']) : (isset($_GET['sort_by']) ? trim($_GET['sort_by']) : 'sort_order');
$sortOrder = isset($_GET['order']) ? strtolower(trim($_GET['order'])) : (isset($_GET['sort_dir']) ? strtolower(trim($_GET['sort_dir'])) : 'asc');

$allowedSortColumns = ['id', 'title', 'duration', 'sort_order', 'created_at', 'updated_at', 'status'];
if (!in_array($sortBy, $allowedSortColumns)) {
    sendResponse(400, null, "Validation Error: Invalid sort column.");
}

if ($sortOrder !== 'asc' && $sortOrder !== 'desc') {
    sendResponse(400, null, "Validation Error: Invalid sort order. Allowed: asc, desc.");
}

try {
    $db = Database::getConnection();

    $conditions = [];
    $params = [];

    if ($moduleIdFilter > 0) {
        $conditions[] = "l.module_id = ?";
        $params[] = $moduleIdFilter;
    }

    if ($statusFilter !== '') {
        $conditions[] = "l.status = ?";
        $params[] = $statusFilter;
    }

    // Role-based constraints: Instructors only see lectures for their own courses
    if ($user['role'] === 'instructor') {
        $conditions[] = "c.created_by = ?";
        $params[] = $user['id'];
    }

    $whereClause = "";
    if (count($conditions) > 0) {
        $whereClause = "WHERE " . implode(" AND ", $conditions);
    }

    // 5. Count total items
    $countSql = "SELECT COUNT(DISTINCT l.id) 
                 FROM lectures l
                 INNER JOIN course_modules m ON l.module_id = m.id
                 INNER JOIN courses c ON m.course_id = c.id
                 $whereClause";
    $stmtCount = $db->prepare($countSql);
    $stmtCount->execute($params);
    $totalItems = (int)$stmtCount->fetchColumn();

    // 6. Fetch lectures page
    // Order by column is validated, so embedding directly is safe from SQL injection
    $sql = "SELECT l.*, m.course_id, m.title AS module_title
            FROM lectures l
            INNER JOIN course_modules m ON l.module_id = m.id
            INNER JOIN courses c ON m.course_id = c.id
            $whereClause
            ORDER BY l.{$sortBy} {$sortOrder}
            LIMIT ? OFFSET ?";

    $stmt = $db->prepare($sql);

    $paramIndex = 1;
    foreach ($params as $param) {
        $stmt->bindValue($paramIndex++, $param);
    }
    $stmt->bindValue($paramIndex++, $limit, PDO::PARAM_INT);
    $stmt->bindValue($paramIndex++, $offset, PDO::PARAM_INT);
    $stmt->execute();

    $lectures = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 7. Role-based visibility logic (check enrollments for students)
    if ($user['role'] === 'student' && !empty($lectures)) {
        // Find distinct course IDs
        $courseIds = array_unique(array_map(function($lec) {
            return (int)$lec['course_id'];
        }, $lectures));

        // Find courses student is enrolled in
        $enrolledCourseIds = [];
        if (!empty($courseIds)) {
            $inClause = implode(',', array_fill(0, count($courseIds), '?'));
            $enrollStmt = $db->prepare("SELECT course_id FROM enrollments WHERE user_id = ? AND course_id IN ($inClause)");
            $enrollStmt->execute(array_merge([$user['id']], $courseIds));
            $enrolledCourseIds = $enrollStmt->fetchAll(PDO::FETCH_COLUMN);
            $enrolledCourseIds = array_map('intval', $enrolledCourseIds);
        }

        // Filter / Redact video details
        foreach ($lectures as &$lec) {
            $courseId = (int)$lec['course_id'];
            $isEnrolled = in_array($courseId, $enrolledCourseIds);
            
            if (!$isEnrolled && !(int)$lec['is_preview']) {
                $lec['video_url'] = null;
                $lec['video_id']  = null;
            }
        }
        unset($lec);
    }

    // Cast types
    foreach ($lectures as &$lec) {
        $lec['id'] = (int)$lec['id'];
        $lec['module_id'] = (int)$lec['module_id'];
        $lec['course_id'] = (int)$lec['course_id'];
        $lec['sort_order'] = (int)$lec['sort_order'];
        $lec['is_preview'] = (int)$lec['is_preview'] === 1;
    }
    unset($lec);

    $totalPages = (int)ceil($totalItems / $limit);

    sendResponse(200, [
        'lectures' => $lectures,
        'pagination' => [
            'total_items' => $totalItems,
            'total_pages' => $totalPages,
            'current_page' => $page,
            'limit' => $limit
        ]
    ], "Lectures retrieved successfully.");

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
