<?php
/**
 * GET /api/notifications
 * Retrieve notifications list for current user
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

try {
    $db = Database::getConnection();
    
    $stmt = $db->prepare("
        SELECT * FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 50
    ");
    $stmt->execute([$currentUser['id']]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($notifications as &$notif) {
        $notif['id'] = (int)$notif['id'];
        $notif['user_id'] = (int)$notif['user_id'];
        $notif['is_read'] = (int)$notif['is_read'] === 1;
    }
    
    sendResponse(200, $notifications, "Notifications retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
