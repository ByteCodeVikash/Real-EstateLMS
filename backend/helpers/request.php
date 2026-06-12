<?php
/**
 * Request Parsing Helpers for BG Realty Training Academy LMS REST API
 */

// Fallback implementation of getallheaders() for non-Apache/CGI setups
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

/**
 * Fetch and decode raw JSON request body into an associative array
 * @return array
 */
function getRequestData(): array {
    $rawInput = file_get_contents('php://input');
    if (empty($rawInput)) {
        return [];
    }

    $decoded = json_decode($rawInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [];
    }

    return $decoded;
}

/**
 * Retrieve authorization bearer token from HTTP headers
 * @return string|null
 */
function getBearerToken(): ?string {
    $authHeader = null;
    
    // Check $_SERVER directly for HTTP_AUTHORIZATION or REDIRECT_HTTP_AUTHORIZATION (common in Apache/CGI setups)
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } else {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
        }
    }

    if ($authHeader && preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
        return $matches[1];
    }

    return null;
}
