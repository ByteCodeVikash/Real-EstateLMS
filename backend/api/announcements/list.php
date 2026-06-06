<?php
/**
 * GET /api/announcements
 * Retrieve list of academy-wide announcements
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Requires authenticated user
$currentUser = requireAuth();

try {
    $db = Database::getConnection();
    
    $stmt = $db->query("
        SELECT a.*, u.full_name as author_name 
        FROM announcements a
        LEFT JOIN users u ON a.created_by = u.id
        ORDER BY a.created_at DESC
    ");
    $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Ensure numeric values are typed correctly
    foreach ($announcements as &$ann) {
        $ann['id'] = (int)$ann['id'];
        $ann['created_by'] = (int)$ann['created_by'];
    }
    
    sendResponse(200, $announcements, "Announcements retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
