<?php
/**
 * Response Formatting Helpers for BG Realty Training Academy LMS REST API
 */

/**
 * Standardized JSON response emitter
 * @param int $statusCode HTTP Status Code
 * @param mixed $data Return payload data
 * @param string $message Friendly status description message
 * @return void
 */
function sendResponse(int $statusCode, $data = null, string $message = ''): void {
    // Clear any previous output buffers to avoid corrupting JSON payload
    if (ob_get_level()) {
        @ob_clean();
    }

    // Set Response Headers
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($statusCode);

    // Build standard API envelope structure
    $response = [
        'status' => ($statusCode >= 200 && $statusCode < 300) ? 'success' : 'error',
        'code' => $statusCode,
        'message' => $message,
        'timestamp' => time()
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}
