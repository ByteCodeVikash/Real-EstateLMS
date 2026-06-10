<?php
/**
 * GET /api/categories/{id}
 * Retrieve a single course category
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Category.php';

// Require authenticated session
$user = requireAuth();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid category ID.");
}

try {
    $category = Category::findById($id);
    
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
