<?php
/**
 * GET /api/categories/{id}
 * Retrieve a single course category
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Require authenticated session
$user = requireAuth();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid category ID.");
}

try {
    $db = Database::getConnection();
    
    $stmt = $db->prepare("SELECT id, name, slug, description, icon, status, created_at, updated_at FROM categories WHERE id = ?");
    $stmt->execute([$id]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$category) {
        sendResponse(404, null, "Category not found.");
    }
    
    // Check access for inactive category
    $isAdmin = in_array($user['role'], ['admin', 'super_admin']);
    if ($category['status'] !== 'Active' && !$isAdmin) {
        sendResponse(404, null, "Category not found.");
    }
    
    sendResponse(200, $category, "Category retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
