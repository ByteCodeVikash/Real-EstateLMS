<?php
/**
 * GET /api/courses/{course_id}/modules
 * List all modules for a course, ordered by sort_order.
 *
 * Query params:
 *   ?status=Published|Draft|Archived   (optional filter; students forced to Published)
 *   ?search=keyword                    (optional title search)
 *   ?page=1                            (pagination, default 1)
 *   ?limit=20                          (per-page count, default 20, max 100)
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Any authenticated user can list modules
$user = requireAuth();

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
if ($courseId <= 0) {
    sendResponse(400, null, "Invalid course ID.");
}

// --- Pagination ---
$page  = isset($_GET['page'])  ? max(1, (int)$_GET['page'])   : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit']          : 20;
if ($limit < 1)   $limit = 20;
if ($limit > 100) $limit = 100;
$offset = ($page - 1) * $limit;

// --- Filters ---
$statusFilter = isset($_GET['status']) ? trim($_GET['status']) : '';
$search       = isset($_GET['search']) ? trim($_GET['search']) : '';

$allowedStatuses = ['Draft', 'Published', 'Archived'];
if ($statusFilter !== '' && !in_array($statusFilter, $allowedStatuses)) {
    sendResponse(400, null, "Invalid status filter. Allowed: Draft, Published, Archived.");
}

// Students can only ever see Published modules
if ($user['role'] === 'student') {
    $statusFilter = 'Published';
}

try {
    $db = Database::getConnection();

    // Verify course exists
    $courseStmt = $db->prepare("SELECT id FROM courses WHERE id = ?");
    $courseStmt->execute([$courseId]);
    if (!$courseStmt->fetch()) {
        sendResponse(404, null, "Course not found.");
    }

    // --- Build WHERE conditions ---
    $conditions = ["course_id = ?"];
    $params     = [$courseId];

    if ($statusFilter !== '') {
        $conditions[] = "status = ?";
        $params[]     = $statusFilter;
    }

    if ($search !== '') {
        $conditions[] = "title LIKE ?";
        $params[]     = "%{$search}%";
    }

    $whereClause = "WHERE " . implode(" AND ", $conditions);

    // --- Total count for pagination ---
    $countSql  = "SELECT COUNT(*) FROM course_modules $whereClause";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $totalItems = (int)$countStmt->fetchColumn();
    $totalPages = (int)ceil($totalItems / $limit);

    // --- Fetch page of modules ---
    $sql  = "SELECT id, course_id, title, description, sort_order, status, created_at, updated_at
             FROM course_modules
             $whereClause
             ORDER BY sort_order ASC
             LIMIT ? OFFSET ?";

    $stmt = $db->prepare($sql);

    $idx = 1;
    foreach ($params as $p) {
        $stmt->bindValue($idx++, $p);
    }
    $stmt->bindValue($idx++, $limit,  PDO::PARAM_INT);
    $stmt->bindValue($idx++, $offset, PDO::PARAM_INT);
    $stmt->execute();

    $modules = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // --- Enrich each module with lecture_count ---
    $lecCountStmt = $db->prepare(
        "SELECT COUNT(*) FROM lectures WHERE module_id = ?"
    );

    foreach ($modules as &$m) {
        $m['id']         = (int)$m['id'];
        $m['course_id']  = (int)$m['course_id'];
        $m['sort_order'] = (int)$m['sort_order'];

        $lecCountStmt->execute([$m['id']]);
        $m['lecture_count'] = (int)$lecCountStmt->fetchColumn();
    }
    unset($m);

    sendResponse(200, [
        'modules'    => $modules,
        'pagination' => [
            'total_items'  => $totalItems,
            'total_pages'  => $totalPages,
            'current_page' => $page,
            'limit'        => $limit,
        ],
    ], "Modules retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
