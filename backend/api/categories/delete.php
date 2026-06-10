<?php
/**
 * DELETE /api/categories/{id}
 * Delete a course category
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Category.php';

// Require Admin role
$user = requireAdmin();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid category ID.");
}

try {
    // Retrieve category
    $category = Category::findById($id);
    if (!$category) {
        sendResponse(404, null, "Category not found.");
    }
    
    $db = Database::getConnection();
    
    // Check if courses are linked to this category ID
    $stmtCourse = $db->prepare("SELECT COUNT(*) FROM courses WHERE category_id = ?");
    $stmtCourse->execute([$id]);
    $courseCount = (int)$stmtCourse->fetchColumn();
    
    if ($courseCount > 0) {
        sendResponse(409, null, "Conflict: Cannot delete category '{$category['name']}' because it is linked to {$courseCount} course(s). Please reassign those courses first.");
    }
    
    // Delete the category
    Category::delete($id);
    
    sendResponse(200, ['id' => $id], "Category deleted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
