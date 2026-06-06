<?php
/**
 * DELETE /api/announcements/{id}
 * Delete an announcement (Admins, Instructors, Super Admins only)
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

// Authorization: admin, super_admin, instructor only
if (!in_array($currentUser['role'], ['admin', 'super_admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators or instructors can delete announcements.");
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Validation Error: Valid announcement ID is required.");
}

try {
    $db = Database::getConnection();
    
    // Check if exists
    $checkStmt = $db->prepare("SELECT id FROM announcements WHERE id = ?");
    $checkStmt->execute([$id]);
    if (!$checkStmt->fetch()) {
        sendResponse(404, null, "Not Found: Announcement does not exist.");
    }
    
    $stmt = $db->prepare("DELETE FROM announcements WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(200, null, "Announcement deleted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
