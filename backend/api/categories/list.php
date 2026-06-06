<?php
/**
 * GET /api/categories
 * List all course categories
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Require authenticated session
$user = requireAuth();

try {
    $db = Database::getConnection();
    
    // Admins see all categories, others see only Active ones
    $isAdmin = in_array($user['role'], ['admin', 'super_admin']);
    
    if ($isAdmin) {
        $stmt = $db->query("SELECT id, name, slug, description, icon, status, created_at, updated_at FROM categories ORDER BY name ASC");
    } else {
        $stmt = $db->prepare("SELECT id, name, slug, description, icon, status, created_at, updated_at FROM categories WHERE status = 'Active' ORDER BY name ASC");
        $stmt->execute();
    }
    
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse(200, $categories, "Categories retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
