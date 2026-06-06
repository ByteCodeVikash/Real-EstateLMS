<?php
/**
 * Validate Session and Retrieve User Profile Endpoint for BG Realty Training Academy LMS
 */

if (!defined('SECURE_ENTRY')) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'code' => 403, 'message' => 'Direct access forbidden. Requests must route through index.php.']);
    exit;
}


require_once __DIR__ . '/../../middleware/auth_middleware.php';
require_once __DIR__ . '/../../helpers/response.php';

// requireAuth() enforces authentication gates, checking token decoding and DB existence
$user = requireAuth();

sendResponse(200, [
    'user' => [
        'id'        => (int)$user['id'],
        'full_name' => $user['full_name'],
        'email'     => $user['email'],
        'role'      => $user['role']
    ]
], "Session validated successfully.");
