<?php
/**
 * POST /api/payments/failure
 * Records a payment failure for a Razorpay order.
 * Called by frontend when Razorpay modal dismisses with error or user cancels.
 *
 * Request Body:
 *   {
 *     "razorpay_order_id": "order_Xxx...",
 *     "error_code":        "BAD_REQUEST_ERROR",
 *     "error_description": "Payment cancelled by user"
 *   }
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/request.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

$currentUser = requireAuth();
$data        = getRequestData();

$rzpOrderId       = trim($data['razorpay_order_id']  ?? '');
$errorCode        = trim($data['error_code']          ?? 'UNKNOWN_ERROR');
$errorDescription = trim($data['error_description']   ?? 'No description provided');

if (!$rzpOrderId) {
    sendResponse(400, null, "Validation Error: razorpay_order_id is required.");
}

try {
    $db = Database::getConnection();

    // Find order belonging to this user that is still pending
    $orderStmt = $db->prepare(
        "SELECT id, status FROM orders WHERE razorpay_order_id = ? AND user_id = ?"
    );
    $orderStmt->execute([$rzpOrderId, $currentUser['id']]);
    $order = $orderStmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        sendResponse(404, null, "Not Found: Order does not exist or does not belong to you.");
    }

    // Only mark failure if still pending (don't overwrite a paid order)
    if ($order['status'] === 'pending') {
        $failureReason = sprintf('[%s] %s', $errorCode, $errorDescription);

        $updateStmt = $db->prepare(
            "UPDATE orders SET status='failed', failure_reason=?, updated_at=NOW() WHERE id=?"
        );
        $updateStmt->execute([$failureReason, $order['id']]);
    }

    sendResponse(200, [
        'recorded'          => true,
        'razorpay_order_id' => $rzpOrderId,
        'order_status'      => $order['status'] === 'paid' ? 'paid' : 'failed',
    ], "Payment failure recorded.");

} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
