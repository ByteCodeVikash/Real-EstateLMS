<?php
/**
 * POST /api/categories
 * Create a new course category
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validation.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../models/Category.php';

// Require Admin role
$user = requireAdmin();

$data = getRequestData();

// Extract and prepare fields
$name = isset($data['name']) ? trim(strip_tags((string)$data['name'])) : '';
$slug = isset($data['slug']) ? trim((string)$data['slug']) : '';
if (empty($slug) && !empty($name)) {
    // Slugify name if slug not provided
    $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9\-]+/', '-', $name), '-'));
} else {
    // Sanitize slug
    $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9\-]+/', '-', $slug), '-'));
}

$data['name'] = $name;
$data['slug'] = $slug;

// Run validation helper
$errors = validateCategory($data, false);
if (!empty($errors)) {
    // Map code 409 Conflict if slug conflict error exists
    if (isset($errors['slug']) && $errors['slug'] === "A category with this slug already exists.") {
        sendResponse(409, $errors, "Conflict: A category with this slug already exists.");
    }
    sendResponse(400, $errors, "Validation Error: " . implode(" ", $errors));
}

try {
    // Insert new category
    $newId = Category::create($data);
    
    if (!$newId) {
        sendResponse(500, null, "Internal Server Error: Failed to create category.");
    }
    
    // Retrieve and return the newly created category
    $category = Category::findById($newId);
    
    sendResponse(201, $category, "Category created successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
