<?php
/**
 * Authentication Middleware for BG Realty Training Academy LMS REST API
 */

require_once __DIR__ . '/../helpers/request.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../config/db.php';

/**
 * Authenticates request using Bearer tokens.
 * If authentication fails, exits the request with an unauthorized error.
 * @return array The authenticated user details
 */
function requireAuth(): array {
    $token = getBearerToken();
    
    if (!$token) {
        sendResponse(401, null, "Unauthorized: Authorization token missing.");
    }
    
    // Support mock tokens for easy testing (ONLY in development mode)
    if (APP_ENV === 'development') {
        if ($token === 'mock-student-token') {
            return [
                'id' => 1,
                'full_name' => 'Sarah Jenkins',
                'email' => 'sarah.j@realtypro.com',
                'role' => 'student'
            ];
        } elseif ($token === 'mock-admin-token') {
            return [
                'id' => 1,
                'full_name' => 'Vikash Sharma',
                'email' => 'vikash@bgrealtyacademy.com',
                'role' => 'admin'
            ];
        } elseif ($token === 'mock-superadmin-token') {
            return [
                'id' => 1,
                'full_name' => 'Vikash Super',
                'email' => 'superadmin@bgrealtyacademy.com',
                'role' => 'super_admin'
            ];
        } elseif ($token === 'mock-instructor-token') {
            return [
                'id' => 1,
                'full_name' => 'Instructor Sarah',
                'email' => 'instructor@bgrealtyacademy.com',
                'role' => 'instructor'
            ];
        }
        
        // Check for developer generated sessions
        if (strpos($token, 'RELMS-') === 0) {
            return [
                'id' => 999,
                'full_name' => 'Demo User',
                'email' => 'demo@bgrealtyacademy.com',
                'role' => 'student'
            ];
        }
    }

    $payload = JWT::decode($token);
    if (!$payload) {
        sendResponse(401, null, "Unauthorized: Invalid or expired authorization token.");
    }
    
    try {
        $db = Database::getConnection();
        $user = null;
        $role = $payload['role'] ?? 'student';
        
        if ($role === 'admin' || $role === 'super_admin') {
            $stmt = $db->prepare("SELECT id, name AS full_name, email, role, 'Active' AS status FROM admins WHERE id = ?");
            $stmt->execute([$payload['id']]);
            $user = $stmt->fetch();
            if ($user) {
                $user['role'] = ($user['role'] === 'Super Admin') ? 'super_admin' : 'admin';
            } else {
                $stmt = $db->prepare("SELECT id, full_name, email, role, status FROM users WHERE id = ?");
                $stmt->execute([$payload['id']]);
                $user = $stmt->fetch();
            }
        } else {
            $stmt = $db->prepare("SELECT id, full_name, email, role, status FROM users WHERE id = ?");
            $stmt->execute([$payload['id']]);
            $user = $stmt->fetch();
        }
        
        if (!$user) {
            sendResponse(401, null, "Unauthorized: User account no longer exists.");
        }
        
        if ($user['status'] !== 'Active') {
            sendResponse(403, null, "Forbidden: User account is suspended or inactive.");
        }
        
        return $user;
    } catch (PDOException $e) {
        // Fallback to token payload details if database is offline/unreachable
        return [
            'id' => $payload['id'],
            'full_name' => $payload['full_name'],
            'email' => $payload['email'],
            'role' => $payload['role']
        ];
    }
}

/**
 * Role-based authorization gate.
 * Verifies if the authenticated user has one of the allowed roles.
 * @param array $allowedRoles Array of allowed role names
 * @return array The authenticated user details
 */
function requireRole(array $allowedRoles): array {
    $user = requireAuth();
    if (!in_array($user['role'], $allowedRoles)) {
        sendResponse(403, null, "Forbidden: You do not have the required access permissions.");
    }
    return $user;
}

/**
 * Gate check that demands admin or super_admin access level permissions
 * @return array The authenticated admin details
 */
function requireAdmin(): array {
    return requireRole(['admin', 'super_admin']);
}
