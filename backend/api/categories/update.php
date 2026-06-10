<?php
/**
 * PUT /api/categories/{id}
 * Update an existing course category
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validation.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Category.php';

// Require Admin role
$user = requireAdmin();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid category ID.");
}

$data = getRequestData();

try {
    // Check if category exists
    $existing = Category::findById($id);
    if (!$existing) {
        sendResponse(404, null, "Category not found.");
    }
    
    // Extract and prepare fields if present, keeping existing values as defaults
    $name = isset($data['name']) ? trim(strip_tags((string)$data['name'])) : $existing['name'];
    $slug = isset($data['slug']) ? trim((string)$data['slug']) : $existing['slug'];
    if (empty($slug) && !empty($name)) {
        $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9\-]+/', '-', $name), '-'));
    } else {
        $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9\-]+/', '-', $slug), '-'));
    }
    
    $data['name'] = $name;
    $data['slug'] = $slug;

    // Run validation helper
    $errors = validateCategory($data, true, $id);
    if (!empty($errors)) {
        // Map code 409 Conflict if slug conflict error exists
        if (isset($errors['slug']) && $errors['slug'] === "A category with this slug already exists.") {
            sendResponse(409, $errors, "Conflict: Another category with this slug already exists.");
        }
        sendResponse(400, $errors, "Validation Error: " . implode(" ", $errors));
    }
    
    // Update category
    $success = Category::update($id, $data);
    if (!$success) {
        sendResponse(500, null, "Internal Server Error: Failed to update category.");
    }
    
    // Retrieve and return updated category
    $category = Category::findById($id);
    
    sendResponse(200, $category, "Category updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
