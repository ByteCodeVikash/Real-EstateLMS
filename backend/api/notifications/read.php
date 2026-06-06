<?php
/**
 * POST /api/notifications/{id}/read
 * Mark a notification as read
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Validation Error: Valid notification ID is required.");
}

try {
    $db = Database::getConnection();
    
    // Check if notification exists and belongs to current user
    $checkStmt = $db->prepare("SELECT id FROM notifications WHERE id = ? AND user_id = ?");
    $checkStmt->execute([$id, $currentUser['id']]);
    if (!$checkStmt->fetch()) {
        sendResponse(404, null, "Not Found: Notification does not exist.");
    }
    
    $stmt = $db->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(200, null, "Notification marked as read successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
