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
    
    $stmt = $db->query("
        SELECT id, title, mentor_name, date_time, stream_link, is_live,
               meeting_id, recording_url, status, created_at
        FROM webinars
        ORDER BY date_time DESC
    ");
    $webinars = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $now = new DateTime();

    // Normalise types and derive computed status
    foreach ($webinars as &$web) {
        $web['id']      = (int)$web['id'];
        $web['is_live'] = (int)$web['is_live'] === 1;

        // Compute a display status consistent with what the frontend expects:
        // 'Live' > 'Upcoming' > 'Completed'
        $webDate = !empty($web['date_time']) ? new DateTime($web['date_time']) : null;

        if ($web['is_live']) {
            $web['computed_status'] = 'Live';
        } elseif ($web['recording_url']) {
            $web['computed_status'] = 'Completed';
        } elseif ($webDate && $webDate < $now) {
            $web['computed_status'] = 'Completed';
        } else {
            $web['computed_status'] = 'Upcoming';
        }

        // Expose meeting_id cleanly (null if not set)
        $web['meeting_id'] = $web['meeting_id'] ?? null;
    }
    
    sendResponse(200, $webinars, "Webinars and recorded sessions retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
