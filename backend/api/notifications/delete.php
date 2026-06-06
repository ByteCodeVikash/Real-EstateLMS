<?php
/**
 * DELETE /api/notifications/{id}
 * Delete/dismiss a notification
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
    
    // Check if notification belongs to user
    $checkStmt = $db->prepare("SELECT id FROM notifications WHERE id = ? AND user_id = ?");
    $checkStmt->execute([$id, $currentUser['id']]);
    if (!$checkStmt->fetch()) {
        sendResponse(404, null, "Not Found: Notification does not exist.");
    }
    
    $stmt = $db->prepare("DELETE FROM notifications WHERE id = ?");
    $stmt->execute([$id]);
    
    sendResponse(200, null, "Notification deleted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
