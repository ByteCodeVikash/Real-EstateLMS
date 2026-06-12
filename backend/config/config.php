<?php
/**
 * Configuration Settings for BG Realty Training Academy LMS
 */

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
if (APP_ENV === 'development') {
    define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
    define('DB_NAME', getenv('DB_NAME') ?: 'realestate_lms');
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'root');
    define('DB_PORT', getenv('DB_PORT') ?: '3306');
    define('BASE_URL', getenv('BASE_URL') ?: 'http://localhost/realestateLMS/backend');
} else {
    // Database Connection Settings for Hostinger
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'u834013214_u834013214_lms');
    define('DB_USER', 'u834013214_u834013214_lms');
    define('DB_PASS', 'BJReality_LMS_2026!');
    define('DB_PORT', '3306');
    define('BASE_URL', 'https://ivory-flamingo-965498.hostingersite.com/backend');
}

// Security & Authentication keys
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'bj_reality_academy_secure_key_2026');
define('GOOGLE_CLIENT_ID', '476678466295-8pj5ao3k65gc35grt1o31m7uk60rqvnn.apps.googleusercontent.com');

