<?php
/**
 * GET /api/lectures/{lecture_id}/progress
 * Retrieve student's playhead position and completion status for a lecture.
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();
$lectureId = isset($_GET['lecture_id']) ? (int)$_GET['lecture_id'] : 0;

if ($lectureId <= 0) {
    sendResponse(400, null, "Validation Error: Valid lecture ID is required.");
}

try {
    $db = Database::getConnection();
    
    $stmt = $db->prepare("
        SELECT playhead_seconds, duration_seconds, is_completed, updated_at
        FROM lecture_progress
        WHERE user_id = ? AND lecture_id = ?
    ");
    $stmt->execute([$currentUser['id'], $lectureId]);
    $progress = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$progress) {
        // Return 0 progress
        $progress = [
            'playhead_seconds' => 0,
            'duration_seconds' => 0,
            'is_completed' => 0,
            'updated_at' => null
        ];
    } else {
        $progress['playhead_seconds'] = (int)$progress['playhead_seconds'];
        $progress['duration_seconds'] = (int)$progress['duration_seconds'];
        $progress['is_completed'] = (int)$progress['is_completed'];
    }
    
    sendResponse(200, $progress, "Lecture progress retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
