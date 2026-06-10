<?php
/**
 * GET /api/categories
 * List all course categories with optional search and pagination
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Category.php';

// Require authenticated session
$user = requireAuth();

$page = isset($_GET['page']) ? (int)$_GET['page'] : null;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
$search = isset($_GET['search']) ? trim((string)$_GET['search']) : null;

try {
    // Admins see all categories, others see only Active ones
    $isAdmin = in_array($user['role'], ['admin', 'super_admin']);
    $activeOnly = !$isAdmin;
    
    if ($page !== null || $limit !== null) {
        // Handle pagination defaults
        $pageVal = ($page !== null && $page > 0) ? $page : 1;
        $limitVal = ($limit !== null && $limit > 0) ? $limit : 10;
        
        $totalItems = Category::countAll($activeOnly, $search);
        $totalPages = ceil($totalItems / $limitVal);
        
        $categories = Category::findAll($activeOnly, $search, $pageVal, $limitVal);
        
        sendResponse(200, [
            'categories' => $categories,
            'pagination' => [
                'total_items' => $totalItems,
                'total_pages' => $totalPages,
                'current_page' => $pageVal,
                'limit' => $limitVal
            ]
        ], "Categories retrieved successfully.");
    } else {
        // Return flat categories array for backward compatibility
        $categories = Category::findAll($activeOnly, $search);
        sendResponse(200, $categories, "Categories retrieved successfully.");
    }
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
