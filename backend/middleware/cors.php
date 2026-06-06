<?php
/**
 * CORS Middleware for BG Realty Training Academy LMS REST API
 */

// Allow cross-origin requests from any client origin or dynamic host origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // Cache preflight response for 1 day

// Standard OPTIONS preflight handler (terminate early without database connection overhead)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
