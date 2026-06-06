<?php
/**
 * GET /api/users
 * List all users (admin-only). Supports ?role=student|instructor|admin filter.
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

if (!in_array($currentUser['role'], ['super_admin', 'admin'])) {
    sendResponse(403, null, "Forbidden: Admins only.");
}

$role = isset($_GET['role']) ? trim($_GET['role']) : '';
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = isset($_GET['limit']) ? min(200, max(1, (int)$_GET['limit'])) : 50;
$offset = ($page - 1) * $limit;

try {
    $db = Database::getConnection();

    $whereClause = '';
    $params = [];
    if (!empty($role)) {
        $whereClause = "WHERE u.role = ?";
        $params[] = $role;
    }

    $countSql = "SELECT COUNT(*) FROM users u $whereClause";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $sql = "SELECT 
                u.id, u.full_name, u.email, u.role, u.created_at, u.is_active,
                (SELECT COUNT(*) FROM enrollments e WHERE e.user_id = u.id) AS enrolled_courses,
                (SELECT SUM(e.progress) / NULLIF(COUNT(*), 0) FROM enrollments e WHERE e.user_id = u.id) AS avg_progress
            FROM users u
            $whereClause
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?";

    $params[] = $limit;
    $params[] = $offset;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($users as &$u) {
        $u['id'] = (int)$u['id'];
        $u['enrolled_courses'] = (int)$u['enrolled_courses'];
        $u['avg_progress'] = $u['avg_progress'] !== null ? round((float)$u['avg_progress'], 1) : 0;
        $u['is_active'] = (int)($u['is_active'] ?? 1) === 1;
    }

    sendResponse(200, [
        'users' => $users,
        'total' => $total,
        'page' => $page,
        'limit' => $limit
    ], "Users retrieved successfully.");

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
