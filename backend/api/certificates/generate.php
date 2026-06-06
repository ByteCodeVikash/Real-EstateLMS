<?php
/**
 * POST /api/certificates/generate
 * Verify progress and manually generate certificate if 100% complete
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();
$data = getRequestData();
$courseId = isset($data['course_id']) ? (int)$data['course_id'] : 0;

if ($courseId <= 0) {
    sendResponse(400, null, "Validation Error: Valid course ID is required.");
}

try {
    $db = Database::getConnection();
    
    // Check enrollment progress
    $enrollStmt = $db->prepare("
        SELECT id, progress, certificate_issued 
        FROM enrollments 
        WHERE user_id = ? AND course_id = ?
    ");
    $enrollStmt->execute([$currentUser['id'], $courseId]);
    $enrollment = $enrollStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$enrollment) {
        sendResponse(403, null, "Forbidden: You are not enrolled in this course.");
    }
    
    // Check if progress is 100%
    if ((int)$enrollment['progress'] < 100) {
        // Double check count in case progress field is out of sync
        $totalLecStmt = $db->prepare("
            SELECT COUNT(l.id) 
            FROM lectures l
            JOIN course_modules m ON l.module_id = m.id
            WHERE m.course_id = ?
        ");
        $totalLecStmt->execute([$courseId]);
        $totalLectures = (int)$totalLecStmt->fetchColumn();

        $completedLecStmt = $db->prepare("
            SELECT COUNT(lp.id)
            FROM lecture_progress lp
            JOIN lectures l ON lp.lecture_id = l.id
            JOIN course_modules m ON l.module_id = m.id
            WHERE lp.user_id = ? AND m.course_id = ? AND lp.is_completed = 1
        ");
        $completedLecStmt->execute([$currentUser['id'], $courseId]);
        $completedLectures = (int)$completedLecStmt->fetchColumn();

        $progressPercent = ($totalLectures > 0) ? (int)round(($completedLectures / $totalLectures) * 100) : 0;
        
        if ($progressPercent < 100) {
            sendResponse(400, null, "Bad Request: Course must be 100% complete to issue a certificate. Your progress is {$progressPercent}%.");
        }
        
        // Update enrollment progress
        $updateEnroll = $db->prepare("UPDATE enrollments SET progress = 100, completion_status = 'Completed' WHERE user_id = ? AND course_id = ?");
        $updateEnroll->execute([$currentUser['id'], $courseId]);
    }
    
    // Check if certificate already exists
    $certCheck = $db->prepare("SELECT * FROM certificates WHERE user_id = ? AND course_id = ?");
    $certCheck->execute([$currentUser['id'], $courseId]);
    $existingCert = $certCheck->fetch(PDO::FETCH_ASSOC);
    
    if ($existingCert) {
        $existingCert['id'] = (int)$existingCert['id'];
        $existingCert['user_id'] = (int)$existingCert['user_id'];
        $existingCert['course_id'] = (int)$existingCert['course_id'];
        sendResponse(200, $existingCert, "Certificate already generated.");
    }
    
    // Generate new certificate
    $certNumber = 'CERT-' . str_pad($courseId, 3, '0', STR_PAD_LEFT) . '-' . str_pad($currentUser['id'], 5, '0', STR_PAD_LEFT) . '-' . bin2hex(random_bytes(3));
    
    $issueCert = $db->prepare("INSERT INTO certificates (user_id, course_id, certificate_number) VALUES (?, ?, ?)");
    $issueCert->execute([$currentUser['id'], $courseId, $certNumber]);
    
    // Mark certificate_issued = 1 in enrollments
    $updateCertStatus = $db->prepare("UPDATE enrollments SET certificate_issued = 1 WHERE user_id = ? AND course_id = ?");
    $updateCertStatus->execute([$currentUser['id'], $courseId]);
    
    // Get newly created certificate
    $getCert = $db->prepare("SELECT * FROM certificates WHERE user_id = ? AND course_id = ?");
    $getCert->execute([$currentUser['id'], $courseId]);
    $newCert = $getCert->fetch(PDO::FETCH_ASSOC);
    
    if ($newCert) {
        $newCert['id'] = (int)$newCert['id'];
        $newCert['user_id'] = (int)$newCert['user_id'];
        $newCert['course_id'] = (int)$newCert['course_id'];
    }
    
    sendResponse(201, $newCert, "Certificate generated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
