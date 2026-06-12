<?php
/**
 * CORS Middleware for BG Realty Training Academy LMS REST API
 */

// Whitelist allowed origins
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://ivory-flamingo-965498.hostingersite.com'
];

$isLocal = (php_sapi_name() === 'cli') || in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1']) || in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1']);
$isAllowed = in_array($origin, $allowedOrigins);

if (!$isAllowed && $isLocal) {
    if (preg_match('/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
        $isAllowed = true;
    }
}

if ($isAllowed) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    // If not allowed, restrict to the main secure production site
    header("Access-Control-Allow-Origin: https://ivory-flamingo-965498.hostingersite.com");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // Cache preflight response for 1 day

// Essential Security Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: no-referrer");
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none';");

if (!$isLocal) {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
}

// Standard OPTIONS preflight handler (terminate early without database connection overhead)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
