<?php
/**
 * PUT /api/webinars/{id}
 * Update an existing webinar
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

if (!in_array($currentUser['role'], ['admin', 'super_admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators or instructors can manage webinars.");
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    sendResponse(400, null, "Invalid webinar ID.");
}

try {
    $db = Database::getConnection();
    
    // Check if exists
    $stmt = $db->prepare("SELECT * FROM webinars WHERE id = ?");
    $stmt->execute([$id]);
    $webinar = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$webinar) {
        sendResponse(404, null, "Webinar not found.");
    }
    
    $data         = getRequestData();
    $title        = isset($data['title'])         ? trim($data['title'])         : $webinar['title'];
    $mentorName   = isset($data['mentor_name'])   ? trim($data['mentor_name'])   : $webinar['mentor_name'];
    $dateTime     = isset($data['date_time'])      ? trim($data['date_time'])     : $webinar['date_time'];
    $streamLink   = isset($data['stream_link'])   ? trim($data['stream_link'])   : $webinar['stream_link'];
    $meetingId    = array_key_exists('meeting_id', $data) ? trim($data['meeting_id']) : $webinar['meeting_id'];
    $isLive       = isset($data['is_live'])        ? (int)$data['is_live']        : (int)$webinar['is_live'];
    $recordingUrl = isset($data['recording_url']) ? trim($data['recording_url']) : $webinar['recording_url'];
    
    $updateStmt = $db->prepare("
        UPDATE webinars 
        SET title = ?, mentor_name = ?, date_time = ?, stream_link = ?,
            meeting_id = ?, is_live = ?, recording_url = ? 
        WHERE id = ?
    ");
    $updateStmt->execute([$title, $mentorName, $dateTime, $streamLink, $meetingId, $isLive, $recordingUrl, $id]);
    
    // Fetch updated record
    $getStmt = $db->prepare("
        SELECT id, title, mentor_name, date_time, stream_link, is_live,
               meeting_id, recording_url, status, created_at
        FROM webinars WHERE id = ?
    ");
    $getStmt->execute([$id]);
    $updated = $getStmt->fetch(PDO::FETCH_ASSOC);

    if ($updated) {
        $updated['id']      = (int)$updated['id'];
        $updated['is_live'] = (int)$updated['is_live'] === 1;

        $now = new DateTime();
        $webDate = !empty($updated['date_time']) ? new DateTime($updated['date_time']) : null;

        if ($updated['is_live']) {
            $updated['computed_status'] = 'Live';
        } elseif ($updated['recording_url']) {
            $updated['computed_status'] = 'Completed';
        } elseif ($webDate && $webDate < $now) {
            $updated['computed_status'] = 'Completed';
        } else {
            $updated['computed_status'] = 'Upcoming';
        }

        $updated['meeting_id'] = $updated['meeting_id'] ?? null;
    }
    
    sendResponse(200, $updated, "Webinar updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
