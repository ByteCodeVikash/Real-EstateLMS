<?php
/**
 * User Logout Endpoint for BG Realty Training Academy LMS
 */

if (!defined('SECURE_ENTRY')) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'code' => 403, 'message' => 'Direct access forbidden. Requests must route through index.php.']);
    exit;
}

require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../helpers/response.php';

// Validate client request by ensuring user has a valid session token before logging out
requireAuth();

// In stateless JWT authentication, logout is primarily handled on the client side 
// by deleting the token. This endpoint validates client request and returns success.
sendResponse(200, null, "Logout completed successfully.");
