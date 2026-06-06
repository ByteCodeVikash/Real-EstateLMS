<?php
/**
 * GET /api/certificates
 * Retrieve list of issued certificates for the current user
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

try {
    $db = Database::getConnection();
    
    // Select all certificates for this user, joining courses
    $stmt = $db->prepare("
        SELECT cert.*, c.title as course_title, c.description as course_desc, c.mentor_name
        FROM certificates cert
        JOIN courses c ON cert.course_id = c.id
        WHERE cert.user_id = ?
        ORDER BY cert.issued_at DESC
    ");
    $stmt->execute([$currentUser['id']]);
    $certificates = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($certificates as &$cert) {
        $cert['id'] = (int)$cert['id'];
        $cert['user_id'] = (int)$cert['user_id'];
        $cert['course_id'] = (int)$cert['course_id'];
    }
    
    sendResponse(200, $certificates, "Certificates retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
