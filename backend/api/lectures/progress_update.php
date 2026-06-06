<?php
/**
 * POST /api/lectures/{lecture_id}/progress
 * Save student's playhead position, total duration, and completion status.
 * Automatically updates total course progress and issues a certificate upon 100% completion.
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();
$lectureId = isset($_GET['lecture_id']) ? (int)$_GET['lecture_id'] : 0;

if ($lectureId <= 0) {
    sendResponse(400, null, "Validation Error: Valid lecture ID is required.");
}

$data = getRequestData();
$playhead = isset($data['playhead_seconds']) ? (int)$data['playhead_seconds'] : 0;
$duration = isset($data['duration_seconds']) ? (int)$data['duration_seconds'] : 0;
$isCompleted = isset($data['is_completed']) ? (int)$data['is_completed'] : 0;

try {
    $db = Database::getConnection();

    // 1. Verify lecture exists and get course details
    $stmtLec = $db->prepare("
        SELECT l.id, m.course_id, c.title as course_title 
        FROM lectures l
        JOIN course_modules m ON l.module_id = m.id
        JOIN courses c ON m.course_id = c.id
        WHERE l.id = ?
    ");
    $stmtLec->execute([$lectureId]);
    $lecture = $stmtLec->fetch(PDO::FETCH_ASSOC);

    if (!$lecture) {
        sendResponse(404, null, "Not Found: The requested lecture does not exist.");
    }

    $courseId = (int)$lecture['course_id'];
    $courseTitle = $lecture['course_title'];

    // 2. Check if student is enrolled in this course
    $enrollStmt = $db->prepare("SELECT id, progress, certificate_issued FROM enrollments WHERE user_id = ? AND course_id = ?");
    $enrollStmt->execute([$currentUser['id'], $courseId]);
    $enrollment = $enrollStmt->fetch(PDO::FETCH_ASSOC);

    if (!$enrollment) {
        sendResponse(403, null, "Forbidden: You are not enrolled in this course.");
    }

    // 3. Upsert lecture progress
    $upsertStmt = $db->prepare("
        INSERT INTO lecture_progress (user_id, lecture_id, playhead_seconds, duration_seconds, is_completed)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            playhead_seconds = VALUES(playhead_seconds),
            duration_seconds = VALUES(duration_seconds),
            is_completed = CASE WHEN is_completed = 1 THEN 1 ELSE VALUES(is_completed) END
    ");
    $upsertStmt->execute([$currentUser['id'], $lectureId, $playhead, $duration, $isCompleted]);

    // 4. Calculate total course lectures and completed lectures
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

    // Calculate progress percentage
    $progressPercent = ($totalLectures > 0) ? (int)round(($completedLectures / $totalLectures) * 100) : 0;
    if ($progressPercent > 100) $progressPercent = 100;

    // 5. Update enrollment progress
    $updateEnroll = $db->prepare("
        UPDATE enrollments 
        SET progress = ?, completion_status = ? 
        WHERE user_id = ? AND course_id = ?
    ");
    $completionStatus = ($progressPercent === 100) ? 'Completed' : 'Active';
    $updateEnroll->execute([$progressPercent, $completionStatus, $currentUser['id'], $courseId]);

    // 6. Auto-issue certificate if 100% complete and not already issued
    $certificateIssued = false;
    if ($progressPercent === 100 && (int)$enrollment['certificate_issued'] === 0) {
        $certCheck = $db->prepare("SELECT id FROM certificates WHERE user_id = ? AND course_id = ?");
        $certCheck->execute([$currentUser['id'], $courseId]);
        if (!$certCheck->fetch()) {
            // Generate certificate number
            $certNumber = 'CERT-' . str_pad($courseId, 3, '0', STR_PAD_LEFT) . '-' . str_pad($currentUser['id'], 5, '0', STR_PAD_LEFT) . '-' . bin2hex(random_bytes(3));
            
            $issueCert = $db->prepare("INSERT INTO certificates (user_id, course_id, certificate_number) VALUES (?, ?, ?)");
            $issueCert->execute([$currentUser['id'], $courseId, $certNumber]);
            
            // Mark certificate_issued = 1 in enrollments
            $updateCertStatus = $db->prepare("UPDATE enrollments SET certificate_issued = 1 WHERE user_id = ? AND course_id = ?");
            $updateCertStatus->execute([$currentUser['id'], $courseId]);
            
            // Send Notification to student
            $notifTitle = "Certificate Issued!";
            $notifMsg = "Congratulations! You completed the course '{$courseTitle}' and earned your official certificate: {$certNumber}.";
            $notifStmt = $db->prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'success')");
            $notifStmt->execute([$currentUser['id'], $notifTitle, $notifMsg]);
            
            $certificateIssued = true;
        }
    }

    sendResponse(200, [
        'lecture_id' => $lectureId,
        'playhead_seconds' => $playhead,
        'is_completed' => ($isCompleted === 1 || $progressPercent === 100),
        'course_progress' => $progressPercent,
        'completion_status' => $completionStatus,
        'certificate_issued' => $certificateIssued
    ], "Progress updated successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
