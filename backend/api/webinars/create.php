<?php
/**
 * POST /api/webinars
 * Create/Schedule a new webinar or add a replay (Admins, Instructors, Super Admins only)
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

// Authorization: admin, super_admin, instructor only
if (!in_array($currentUser['role'], ['admin', 'super_admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators or instructors can manage webinars.");
}

$data = getRequestData();
$title = isset($data['title']) ? trim($data['title']) : '';
$mentorName = isset($data['mentor_name']) ? trim($data['mentor_name']) : $currentUser['full_name'];
$dateTime = isset($data['date_time']) ? trim($data['date_time']) : '';
$streamLink = isset($data['stream_link']) ? trim($data['stream_link']) : '';
$isLive = isset($data['is_live']) ? (int)$data['is_live'] : 1;
$recordingUrl = isset($data['recording_url']) ? trim($data['recording_url']) : null;

if (empty($title) || empty($dateTime)) {
    sendResponse(400, null, "Validation Error: Title and Date/Time are required.");
}

try {
    $db = Database::getConnection();
    
    $stmt = $db->prepare("
        INSERT INTO webinars (title, mentor_name, date_time, stream_link, is_live, recording_url) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$title, $mentorName, $dateTime, $streamLink, $isLive, $recordingUrl]);
    
    $newId = $db->lastInsertId();
    
    $getStmt = $db->prepare("SELECT * FROM webinars WHERE id = ?");
    $getStmt->execute([$newId]);
    $webinar = $getStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($webinar) {
        $webinar['id'] = (int)$webinar['id'];
        $webinar['is_live'] = (int)$webinar['is_live'] === 1;
    }
    
    sendResponse(201, $webinar, "Webinar scheduled successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
