<?php
/**
 * POST /api/payments/verify
 * Verifies Razorpay payment signature, marks order as paid, and creates enrollment.
 *
 * Request Body:
 *   {
 *     "razorpay_order_id":   "order_Xxx...",
 *     "razorpay_payment_id": "pay_Xxx...",
 *     "razorpay_signature":  "hex-signature"
 *   }
 *
 * Verification: HMAC-SHA256(key_secret, razorpay_order_id + "|" + razorpay_payment_id)
 * must equal razorpay_signature.
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();
$data        = getRequestData();

$rzpOrderId   = trim($data['razorpay_order_id']   ?? '');
$rzpPaymentId = trim($data['razorpay_payment_id'] ?? '');
$rzpSignature = trim($data['razorpay_signature']  ?? '');

if (!$rzpOrderId || !$rzpPaymentId || !$rzpSignature) {
    sendResponse(400, null, "Validation Error: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.");
}

try {
    $db = Database::getConnection();

    // 1. Find the pending order belonging to this user
    $orderStmt = $db->prepare(
        "SELECT id, user_id, course_id, amount, currency, status
         FROM orders
         WHERE razorpay_order_id = ? AND user_id = ?"
    );
    $orderStmt->execute([$rzpOrderId, $currentUser['id']]);
    $order = $orderStmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        sendResponse(404, null, "Not Found: Order does not exist or does not belong to you.");
    }

    if ($order['status'] === 'paid') {
        // Idempotent — already verified, return existing enrollment
        $enroll = $db->prepare("SELECT id FROM enrollments WHERE order_id = ?");
        $enroll->execute([$order['id']]);
        $existing = $enroll->fetch(PDO::FETCH_ASSOC);
        sendResponse(200, ['already_paid' => true, 'enrollment_id' => $existing['id'] ?? null], "Payment already verified.");
    }

    if ($order['status'] === 'failed') {
        sendResponse(400, null, "Bad Request: This order was previously marked as failed.");
    }

    // 2. Verify HMAC-SHA256 signature
    $expectedSignature = hash_hmac(
        'sha256',
        $rzpOrderId . '|' . $rzpPaymentId,
        RAZORPAY_KEY_SECRET
    );

    if (!hash_equals($expectedSignature, $rzpSignature)) {
        // Signature mismatch — mark order failed
        $failStmt = $db->prepare(
            "UPDATE orders SET status='failed', failure_reason=?, razorpay_payment_id=? WHERE id=?"
        );
        $failStmt->execute(['Signature verification failed', $rzpPaymentId, $order['id']]);
        sendResponse(400, null, "Payment Error: Signature verification failed. Possible tampered request.");
    }

    // 3. Signature valid — begin transaction
    $db->beginTransaction();

    try {
        // Update order to paid
        $updateOrder = $db->prepare(
            "UPDATE orders
             SET status='paid', razorpay_payment_id=?, razorpay_signature=?, updated_at=NOW()
             WHERE id=?"
        );
        $updateOrder->execute([$rzpPaymentId, $rzpSignature, $order['id']]);

        // Check if enrollment already exists (race condition guard)
        $existCheck = $db->prepare(
            "SELECT id FROM enrollments WHERE user_id=? AND course_id=?"
        );
        $existCheck->execute([$order['user_id'], $order['course_id']]);
        $existingEnrollment = $existCheck->fetch(PDO::FETCH_ASSOC);

        $enrollmentId = null;

        if ($existingEnrollment) {
            // Already enrolled — just update payment_status
            $updateEnroll = $db->prepare(
                "UPDATE enrollments SET order_id=?, payment_status='paid' WHERE id=?"
            );
            $updateEnroll->execute([$order['id'], $existingEnrollment['id']]);
            $enrollmentId = $existingEnrollment['id'];
        } else {
            // Create enrollment
            $createEnroll = $db->prepare(
                "INSERT INTO enrollments
                    (user_id, course_id, progress, completion_status, certificate_issued, order_id, payment_status)
                 VALUES (?, ?, 0, 'Active', 0, ?, 'paid')"
            );
            $createEnroll->execute([
                $order['user_id'],
                $order['course_id'],
                $order['id']
            ]);
            $enrollmentId = $db->lastInsertId();
        }

        $db->commit();

        sendResponse(200, [
            'success'        => true,
            'enrollment_id'  => (int)$enrollmentId,
            'razorpay_payment_id' => $rzpPaymentId,
            'amount'         => $order['amount'],
            'currency'       => $order['currency'],
        ], "Payment verified and enrollment created successfully.");

    } catch (Exception $innerEx) {
        $db->rollBack();
        throw $innerEx;
    }

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
