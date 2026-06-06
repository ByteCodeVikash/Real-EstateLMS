<?php
/**
 * User Logout Endpoint for BG Realty Training Academy LMS
 */

if (!defined('SECURE_ENTRY')) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'code' => 403, 'message' => 'Direct access forbidden. Requests must route through index.php.']);
    exit;
}

require_once __DIR__ . '/../../helpers/response.php';

// In stateless JWT authentication, logout is primarily handled on the client side 
// by deleting the token. This endpoint validates client request and returns success.
sendResponse(200, null, "Logout completed successfully.");
