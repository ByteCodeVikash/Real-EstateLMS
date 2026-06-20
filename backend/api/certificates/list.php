<?php
/**
 * GET /api/certificates
 * - Student: Returns own certificates (joined with course info)
 * - Admin / Super Admin: Returns all issued certificates (joined with user + course info)
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

try {
    $db = Database::getConnection();

    $isAdmin = in_array($currentUser['role'], ['admin', 'super_admin']);

    if ($isAdmin) {
        // Admin view: all certificates with student info
        $stmt = $db->prepare("
            SELECT
                cert.*,
                c.title  AS course_title,
                c.mentor_name,
                u.full_name AS student_name,
                u.email     AS student_email
            FROM certificates cert
            JOIN courses c ON cert.course_id = c.id
            JOIN users   u ON cert.user_id   = u.id
            ORDER BY cert.issued_at DESC
        ");
        $stmt->execute();
    } else {
        // Student view: own certificates only
        $stmt = $db->prepare("
            SELECT cert.*, c.title AS course_title, c.description AS course_desc, c.mentor_name
            FROM certificates cert
            JOIN courses c ON cert.course_id = c.id
            WHERE cert.user_id = ?
            ORDER BY cert.issued_at DESC
        ");
        $stmt->execute([$currentUser['id']]);
    }

    $certificates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($certificates as &$cert) {
        $cert['id']        = (int)$cert['id'];
        $cert['user_id']   = (int)$cert['user_id'];
        $cert['course_id'] = (int)$cert['course_id'];
    }

    sendResponse(200, $certificates, "Certificates retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
