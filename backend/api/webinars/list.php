<?php
/**
 * GET /api/webinars
 * Retrieve list of live classes and recorded session replays
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

try {
    $db = Database::getConnection();
    
    $stmt = $db->query("SELECT * FROM webinars ORDER BY date_time DESC");
    $webinars = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format types
    foreach ($webinars as &$web) {
        $web['id'] = (int)$web['id'];
        $web['is_live'] = (int)$web['is_live'] === 1;
    }
    
    sendResponse(200, $webinars, "Webinars and recorded sessions retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
