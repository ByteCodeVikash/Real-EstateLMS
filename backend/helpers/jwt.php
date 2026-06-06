<?php
/**
 * Lightweight JWT Helper for BG Realty Training Academy LMS REST API
 */

require_once __DIR__ . '/../config/config.php';

class JWT {
    /**
     * Encode payload array to JWT token string
     * @param array $payload Key-value attributes to store in token
     * @return string
     */
    public static function encode(array $payload): string {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Decode and verify JWT token string
     * @param string $token
     * @return array|null Decoded payload on success, null on invalid signature/expiration
     */
    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        list($header, $payload, $signature) = $parts;

        // Verify Header Algorithm
        $decodedHeader = json_decode(self::base64UrlDecode($header), true);
        if (!$decodedHeader || ($decodedHeader['alg'] ?? '') !== 'HS256') {
            return null;
        }

        // Verify Signature
        $expectedSignature = hash_hmac('sha256', $header . "." . $payload, JWT_SECRET, true);
        $base64ExpectedSignature = self::base64UrlEncode($expectedSignature);

        if (!hash_equals($base64ExpectedSignature, $signature)) {
            return null;
        }

        $decodedPayload = json_decode(self::base64UrlDecode($payload), true);
        if (!$decodedPayload) {
            return null;
        }

        // Verify Expiration (exp) if present
        if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) {
            return null;
        }

        return $decodedPayload;
    }

    private static function base64UrlEncode(string $data): string {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode(string $data): string {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }
}
