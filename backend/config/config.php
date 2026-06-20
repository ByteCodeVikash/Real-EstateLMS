<?php
/**
 * Configuration Settings for BG Realty Training Academy LMS
 */

// Load environment variables if .env exists
function loadEnv() {
    $paths = [
        dirname(__DIR__) . '/.env',
        dirname(dirname(__DIR__)) . '/.env'
    ];
    foreach ($paths as $path) {
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                // Skip comments
                if (empty($line) || strpos($line, '#') === 0) {
                    continue;
                }
                $parts = explode('=', $line, 2);
                if (count($parts) === 2) {
                    $key = trim($parts[0]);
                    $value = trim($parts[1]);
                    // Strip quotes
                    $value = trim($value, "\"'");
                    // Only set if not already set by system environment
                    if (getenv($key) === false) {
                        putenv("$key=$value");
                    }
                    if (!isset($_ENV[$key])) {
                        $_ENV[$key] = $value;
                    }
                    if (!isset($_SERVER[$key])) {
                        $_SERVER[$key] = $value;
                    }
                }
            }
            break;
        }
    }
}
loadEnv();

// Set Default Timezone
date_default_timezone_set('Asia/Kolkata');

// Detect environment mode: 'development' or 'production'
$isLocal = (php_sapi_name() === 'cli') || in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1']) || in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1']);
$env = getenv('APP_ENV');
if ($env === 'production' || $env === 'development') {
    define('APP_ENV', $env);
} else {
    define('APP_ENV', $isLocal ? 'development' : 'production');
}

// Error reporting settings based on environment
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Database & Base URL Connection Settings
define('DB_HOST',          getenv('DB_HOST')          ?: (APP_ENV === 'development' ? '127.0.0.1' : 'localhost'));
define('DB_NAME',          getenv('DB_NAME')          ?: (APP_ENV === 'development' ? 'realestate_lms' : 'u834013214_u834013214_lms'));
define('DB_USER',          getenv('DB_USER')          ?: (APP_ENV === 'development' ? 'root' : 'u834013214_u834013214_lms'));
define('DB_PASS',          getenv('DB_PASS')          !== false ? getenv('DB_PASS')          : (APP_ENV === 'development' ? 'root' : ''));
define('DB_PORT',          getenv('DB_PORT')          ?: '3306');
define('DB_PASS_FALLBACK', getenv('DB_PASS_FALLBACK') !== false ? getenv('DB_PASS_FALLBACK') : '');
define('BASE_URL',         getenv('BASE_URL')         ?: (APP_ENV === 'development' ? 'http://localhost/realestateLMS/backend' : 'https://ivory-flamingo-965498.hostingersite.com/backend'));

// Security & Authentication keys
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'bj_reality_academy_secure_key_2026');
define('GOOGLE_CLIENT_ID', getenv('GOOGLE_CLIENT_ID') ?: '476678466295-8pj5ao3k65gc35grt1o31m7uk60rqvnn.apps.googleusercontent.com');

// Frontend URL (used to mitigate Host Header Injection in forgot-password flow)
define('FRONTEND_URL', getenv('FRONTEND_URL') ?: 'http://localhost:5173');

// Razorpay Payment Gateway credentials
define('RAZORPAY_KEY_ID',     getenv('RAZORPAY_KEY_ID')     ?: '');
define('RAZORPAY_KEY_SECRET', getenv('RAZORPAY_KEY_SECRET') ?: '');
define('RAZORPAY_CURRENCY',   'INR');


