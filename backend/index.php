<?php
/**
 * Front Controller and Router for BG Realty Training Academy LMS REST API
 */

// Define secure entrypoint token
define('SECURE_ENTRY', true);


// 1. Load CORS middleware first to handle preflight OPTIONS handshakes instantly
require_once __DIR__ . '/middleware/cors.php';

// 2. Load configurations and response helpers
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/helpers/response.php';

// Catch global unhandled exceptions to return valid JSON error structures
set_exception_handler(function ($exception) {
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    $errorMessage = "[" . date('Y-m-d H:i:s') . "] Unhandled Exception: " . $exception->getMessage() . " in " . $exception->getFile() . " on line " . $exception->getLine() . "\n";
    @error_log($errorMessage, 3, $logDir . '/exceptions.log');

    $code = 500;
    if ($exception instanceof PDOException) {
        $code = 503; // Service Unavailable / Database Offline
        $msg = "Database service currently unavailable. Please verify connection credentials.";
    } else {
        $msg = "Internal Server Error: " . (APP_ENV === 'development' ? $exception->getMessage() : "An unexpected server error occurred.");
    }
    
    sendResponse($code, null, $msg);
});

// 3. Resolve Request URIs
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Parse base path (supports hosting in subfolders/directories in Hostinger shared environments)
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
// If SCRIPT_NAME doesn't point to index.php, we are running under the PHP CLI server router
$basePath = (basename($scriptName) === 'index.php') ? dirname($scriptName) : '';

// Strip base path from request URI
if ($basePath !== '' && $basePath !== '/' && strpos($requestUri, $basePath) === 0) {
    $requestUri = substr($requestUri, strlen($basePath));
}

// Strip query parameters
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'] ?? '/';

// Normalize trailing slashes
$path = '/' . trim($path, '/');

// 4. Load route maps
$routes = require __DIR__ . '/routes/api.php';

// Construct matching registry key
$routeKey = "{$requestMethod} {$path}";

$matchedHandler = null;
$routeParams = [];

if (array_key_exists($routeKey, $routes)) {
    $matchedHandler = $routes[$routeKey];
} else {
    foreach ($routes as $routePattern => $handler) {
        if (strpos($routePattern, '{') !== false) {
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $routePattern);
            $pattern = '#^' . str_replace(' ', '\s+', $pattern) . '$#';
            if (preg_match($pattern, $routeKey, $matches)) {
                $matchedHandler = $handler;
                foreach ($matches as $key => $value) {
                    if (is_string($key)) {
                        $routeParams[$key] = $value;
                        $_GET[$key] = $value;
                    }
                }
                break;
            }
        }
    }
}

if ($matchedHandler) {
    $handlerFile = __DIR__ . '/' . $matchedHandler;
    if (file_exists($handlerFile)) {
        require_once $handlerFile;
        exit;
    } else {
        sendResponse(500, null, "Routing Error: Endpoint handler file not found.");
    }
}

// Fallback for route mismatch
sendResponse(404, null, "Endpoint Not Found: {$requestMethod} {$path}");
