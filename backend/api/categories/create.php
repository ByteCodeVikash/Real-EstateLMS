<?php
/**
 * POST /api/categories
 * Create a new course category
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Require Admin role
$user = requireAdmin();

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
// Slugify function
$slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9\-]+/', '-', $slug), '-'));

if (empty($slug)) {
    sendResponse(400, null, "Validation Error: Category slug could not be determined.");
}

try {
    $db = Database::getConnection();
    
    // Check for unique slug
    $stmt = $db->prepare("SELECT id FROM categories WHERE slug = ?");
    $stmt->execute([$slug]);
    if ($stmt->fetch()) {
        sendResponse(409, null, "Conflict: A category with this slug already exists.");
    }
    
    // Insert category
    $stmt = $db->prepare("INSERT INTO categories (name, slug, description, icon, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $slug, $description, $icon, $status]);
    
    $newId = $db->lastInsertId();
    
    // Retrieve the newly created category
    $stmt = $db->prepare("SELECT id, name, slug, description, icon, status, created_at, updated_at FROM categories WHERE id = ?");
    $stmt->execute([$newId]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);
    
    sendResponse(201, $category, "Category created successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
