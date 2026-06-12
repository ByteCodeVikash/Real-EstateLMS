<?php
/**
 * Rate Limiting & Brute Force Protection Helper for BG Realty Training Academy LMS
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/response.php';

/**
 * Ensures security tables exist in the database (Self-Healing).
 *
 * @param PDO $db The database connection
 */
function ensureSecurityTablesExist(PDO $db) {
    static $initialized = false;
    if ($initialized) {
        return;
    }

    try {
        $db->exec("CREATE TABLE IF NOT EXISTS `rate_limits` (
            `ip_address` VARCHAR(45) NOT NULL,
            `endpoint` VARCHAR(100) NOT NULL,
            `request_time` INT NOT NULL,
            INDEX `idx_ip_endpoint_time` (`ip_address`, `endpoint`, `request_time`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $db->exec("CREATE TABLE IF NOT EXISTS `failed_logins` (
            `email` VARCHAR(100) NOT NULL,
            `ip_address` VARCHAR(45) NOT NULL,
            `attempt_time` INT NOT NULL,
            INDEX `idx_email_time` (`email`, `attempt_time`),
            INDEX `idx_ip_time` (`ip_address`, `attempt_time`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $initialized = true;
    } catch (Exception $e) {
        error_log("Failed to initialize security tables: " . $e->getMessage());
    }
}

/**
 * Enforces rate limiting on a specific endpoint.
 *
 * @param string $endpoint The API endpoint name (e.g. 'login', 'signup')
 * @param int $maxRequests Maximum number of requests allowed in the window
 * @param int $windowSeconds Time window in seconds
 */
function checkRateLimit(string $endpoint, int $maxRequests = 30, int $windowSeconds = 60) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $currentTime = time();
    $cutoffTime = $currentTime - $windowSeconds;

    try {
        $db = Database::getConnection();
        ensureSecurityTablesExist($db);

        // Probabilistic pruning (1% chance)
        if (rand(1, 100) === 1) {
            $pruneStmt = $db->prepare("DELETE FROM rate_limits WHERE request_time < ?");
            $pruneStmt->execute([$currentTime - 3600]);
        }

        // Count requests in the window
        $stmt = $db->prepare("SELECT COUNT(*) FROM rate_limits WHERE ip_address = ? AND endpoint = ? AND request_time > ?");
        $stmt->execute([$ip, $endpoint, $cutoffTime]);
        $requestCount = (int)$stmt->fetchColumn();

        if ($requestCount >= $maxRequests) {
            sendResponse(429, null, "Too Many Requests: Rate limit exceeded. Please try again later.");
        }

        // Record current request
        $insertStmt = $db->prepare("INSERT INTO rate_limits (ip_address, endpoint, request_time) VALUES (?, ?, ?)");
        $insertStmt->execute([$ip, $endpoint, $currentTime]);

    } catch (Exception $e) {
        // Fail open: log the error and allow access rather than blocking the user during database anomalies
        error_log("Rate limiting security warning: " . $e->getMessage());
    }
}

/**
 * Checks for brute force attempts on an account identifier.
 *
 * @param string $email Account email address
 * @param int $maxFailed Maximum allowed failed attempts
 * @param int $lockoutSeconds Lockout duration in seconds (default: 15 minutes)
 */
function checkBruteForce(string $email, int $maxFailed = 5, int $lockoutSeconds = 900) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $currentTime = time();
    $cutoffTime = $currentTime - $lockoutSeconds;

    try {
        $db = Database::getConnection();
        ensureSecurityTablesExist($db);

        // Probabilistic pruning (1% chance)
        if (rand(1, 100) === 1) {
            $pruneStmt = $db->prepare("DELETE FROM failed_logins WHERE attempt_time < ?");
            $pruneStmt->execute([$currentTime - 86400]);
        }

        // Count failed attempts
        $stmt = $db->prepare("SELECT COUNT(*) FROM failed_logins WHERE (email = ? OR ip_address = ?) AND attempt_time > ?");
        $stmt->execute([$email, $ip, $cutoffTime]);
        $failedCount = (int)$stmt->fetchColumn();

        if ($failedCount >= $maxFailed) {
            sendResponse(429, null, "Too Many Requests: Account temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.");
        }

    } catch (Exception $e) {
        // Fail open: log warning
        error_log("Brute force check security warning: " . $e->getMessage());
    }
}

/**
 * Records a failed login attempt.
 *
 * @param string $email Account email address
 */
function recordFailedLogin(string $email) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $currentTime = time();

    try {
        $db = Database::getConnection();
        ensureSecurityTablesExist($db);

        $stmt = $db->prepare("INSERT INTO failed_logins (email, ip_address, attempt_time) VALUES (?, ?, ?)");
        $stmt->execute([$email, $ip, $currentTime]);
    } catch (Exception $e) {
        error_log("Failed to record login failure: " . $e->getMessage());
    }
}

/**
 * Clears failed login attempts for a successful login.
 *
 * @param string $email Account email address
 */
function clearFailedLogins(string $email) {
    try {
        $db = Database::getConnection();
        ensureSecurityTablesExist($db);

        $stmt = $db->prepare("DELETE FROM failed_logins WHERE email = ?");
        $stmt->execute([$email]);
    } catch (Exception $e) {
        error_log("Failed to clear login failures: " . $e->getMessage());
    }
}
