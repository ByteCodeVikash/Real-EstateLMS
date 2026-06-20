<?php
/**
 * Database Connection Wrapper using PDO
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $conn = null;

    /**
     * Retrieve a shared PDO connection instance
     * @return PDO
     * @throws PDOException
     */
    public static function getConnection(): PDO {
        if (self::$conn === null) {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // Fallback attempt: if connection fails, try DB_PASS_FALLBACK if defined and non-empty
                $fallbackPass = defined('DB_PASS_FALLBACK') ? DB_PASS_FALLBACK : '';
                if ($fallbackPass !== '' && $fallbackPass !== DB_PASS) {
                    try {
                        self::$conn = new PDO($dsn, DB_USER, $fallbackPass, $options);
                    } catch (PDOException $fallbackEx) {
                        // Both failed, log error and throw the original exception
                        $logDir = dirname(__DIR__) . '/logs';
                        if (!is_dir($logDir)) {
                            @mkdir($logDir, 0755, true);
                        }
                        
                        $errorMessage = "[" . date('Y-m-d H:i:s') . "] Database Connection Failure (both primary and fallback failed): " . $e->getMessage() . " | Fallback: " . $fallbackEx->getMessage() . "\n";
                        @error_log($errorMessage, 3, $logDir . '/db_errors.log');
                        
                        throw $e;
                    }
                } else {
                    // Log error and throw the exception
                    $logDir = dirname(__DIR__) . '/logs';
                    if (!is_dir($logDir)) {
                        @mkdir($logDir, 0755, true);
                    }
                    
                    $errorMessage = "[" . date('Y-m-d H:i:s') . "] Database Connection Failure: " . $e->getMessage() . "\n";
                    @error_log($errorMessage, 3, $logDir . '/db_errors.log');
                    
                    throw $e;
                }
            }
        }

        return self::$conn;
    }
}
