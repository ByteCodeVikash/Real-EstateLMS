<?php
/**
 * POST /api/payments/create-order
 * Initiates a Razorpay payment order for a course purchase.
 *
 * For free courses (price = 0): directly creates enrollment and returns {free: true}.
 * For paid courses: creates a Razorpay order via REST API and inserts a pending `orders` row.
 *
 * Request Body:
 *   { "course_id": 5 }
 *
 * Response (paid):
 *   { razorpay_order_id, amount_paise, currency, key_id, course_title, user_name, user_email }
 *
 * Response (free):
 *   { free: true, enrollment: {...} }
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();

$data     = getRequestData();
$courseId = isset($data['course_id']) ? (int)$data['course_id'] : 0;

if ($courseId <= 0) {
    sendResponse(400, null, "Validation Error: Valid course_id is required.");
}

try {
    $db = Database::getConnection();

    // 1. Fetch course
    $courseStmt = $db->prepare("SELECT id, title, price, status FROM courses WHERE id = ?");
    $courseStmt->execute([$courseId]);
    $course = $courseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$course) {
        sendResponse(404, null, "Not Found: Course does not exist.");
    }
    if ($course['status'] !== 'Published') {
        sendResponse(400, null, "Bad Request: Course is not published.");
    }

    // 2. Check already enrolled
    $enrollCheck = $db->prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?");
    $enrollCheck->execute([$currentUser['id'], $courseId]);
    if ($enrollCheck->fetch()) {
        sendResponse(400, null, "Bad Request: You are already enrolled in this course.");
    }

    $price = (float)$course['price'];

    // 3. Free course — enroll directly
    if ($price <= 0) {
        $insertEnroll = $db->prepare(
            "INSERT INTO enrollments (user_id, course_id, progress, completion_status, certificate_issued, payment_status)
             VALUES (?, ?, 0, 'Active', 0, 'free')"
        );
        $insertEnroll->execute([$currentUser['id'], $courseId]);
        $newId = $db->lastInsertId();

        $getEnroll = $db->prepare(
            "SELECT id, user_id, course_id, status, enrolled_at, progress, completion_status, payment_status
             FROM enrollments WHERE id = ?"
        );
        $getEnroll->execute([$newId]);
        $enrollment = $getEnroll->fetch(PDO::FETCH_ASSOC);

        sendResponse(200, ['free' => true, 'enrollment' => $enrollment], "Free course enrolled successfully.");
    }

    // 4. Paid course — create Razorpay order via REST
    $amountPaise = (int)round($price * 100); // Razorpay expects smallest currency unit (paise)
    $receiptId   = 'rcpt_' . $currentUser['id'] . '_' . $courseId . '_' . time();

    $razorpayPayload = json_encode([
        'amount'   => $amountPaise,
        'currency' => RAZORPAY_CURRENCY,
        'receipt'  => $receiptId,
        'notes'    => [
            'course_id'   => (string)$courseId,
            'course_name' => $course['title'],
            'user_id'     => (string)$currentUser['id'],
            'user_email'  => $currentUser['email']
        ]
    ]);

    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $razorpayPayload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_USERPWD        => RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_TIMEOUT        => 30,
    ]);

    $razorpayResponse = curl_exec($ch);
    $httpCode         = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError        = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        sendResponse(502, null, "Gateway Error: Could not reach Razorpay. " . $curlError);
    }

    $rzpData = json_decode($razorpayResponse, true);

    if ($httpCode !== 200 || empty($rzpData['id'])) {
        $errMsg = $rzpData['error']['description'] ?? 'Unknown Razorpay error';
        sendResponse(502, null, "Payment Gateway Error: " . $errMsg);
    }

    // 5. Persist pending order record
    $insertOrder = $db->prepare(
        "INSERT INTO orders (user_id, course_id, razorpay_order_id, amount, currency, status)
         VALUES (?, ?, ?, ?, ?, 'pending')"
    );
    $insertOrder->execute([
        $currentUser['id'],
        $courseId,
        $rzpData['id'],
        $price,
        RAZORPAY_CURRENCY
    ]);

    sendResponse(200, [
        'razorpay_order_id' => $rzpData['id'],
        'amount_paise'      => $amountPaise,
        'amount'            => $price,
        'currency'          => RAZORPAY_CURRENCY,
        'key_id'            => RAZORPAY_KEY_ID,
        'course_id'         => $courseId,
        'course_title'      => $course['title'],
        'user_name'         => $currentUser['full_name'],
        'user_email'        => $currentUser['email'],
    ], "Razorpay order created successfully.");

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
