<?php
/**
 * PUT /api/categories/{id}
 * Update an existing course category
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Require Admin role
$user = requireAdmin();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid category ID.");
}

$data = getRequestData();

$name = trim(strip_tags($data['name'] ?? ''));
$description = trim(strip_tags($data['description'] ?? ''));
$icon = trim(strip_tags($data['icon'] ?? 'Layers'));
$status = trim(strip_tags($data['status'] ?? 'Active'));

if (empty($name)) {
    sendResponse(400, null, "Validation Error: Category name is required.");
}

if (!in_array($status, ['Active', 'Inactive'])) {
    sendResponse(400, null, "Validation Error: Status must be either 'Active' or 'Inactive'.");
}

// Generate/sanitize slug
$slug = $data['slug'] ?? '';
if (empty($slug)) {
    $slug = $name;
}
$slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9\-]+/', '-', $slug), '-'));

if (empty($slug)) {
    sendResponse(400, null, "Validation Error: Category slug could not be determined.");
}

try {
    $db = Database::getConnection();
    
    // Check if category exists
    $stmt = $db->prepare("SELECT id FROM categories WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        sendResponse(404, null, "Category not found.");
    }
    
    // Check for unique slug excluding current category ID
    $stmt = $db->prepare("SELECT id FROM categories WHERE slug = ? AND id != ?");
    $stmt->execute([$slug, $id]);
    if ($stmt->fetch()) {
        sendResponse(409, null, "Conflict: Another category with this slug already exists.");
    }
    
    // Update category
    $stmt = $db->prepare("UPDATE categories SET name = ?, slug = ?, description = ?, icon = ?, status = ? WHERE id = ?");
    $stmt->execute([$name, $slug, $description, $icon, $status, $id]);
    
    // Retrieve and return updated category
    $stmt = $db->prepare("SELECT id, name, slug, description, icon, status, created_at, updated_at FROM categories WHERE id = ?");
    $stmt->execute([$id]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);
    
    sendResponse(200, $category, "Category updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
