<?php
/**
 * POST /api/announcements
 * Create a new announcement (Admins, Instructors, Super Admins only)
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

// Authorization: admin, super_admin, instructor only
if (!in_array($currentUser['role'], ['admin', 'super_admin', 'instructor'])) {
    sendResponse(403, null, "Forbidden: Only administrators or instructors can post announcements.");
}

$data = getRequestData();
$title = isset($data['title']) ? trim($data['title']) : '';
$content = isset($data['content']) ? trim($data['content']) : '';

if (empty($title) || empty($content)) {
    sendResponse(400, null, "Validation Error: Title and content are required.");
}

try {
    $db = Database::getConnection();
    
    $stmt = $db->prepare("INSERT INTO announcements (title, content, created_by) VALUES (?, ?, ?)");
    $stmt->execute([$title, $content, $currentUser['id']]);
    
    $newId = $db->lastInsertId();
    
    $getStmt = $db->prepare("
        SELECT a.*, u.full_name as author_name 
        FROM announcements a
        LEFT JOIN users u ON a.created_by = u.id
        WHERE a.id = ?
    ");
    $getStmt->execute([$newId]);
    $announcement = $getStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($announcement) {
        $announcement['id'] = (int)$announcement['id'];
        $announcement['created_by'] = (int)$announcement['created_by'];
    }
    
    sendResponse(201, $announcement, "Announcement posted successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
