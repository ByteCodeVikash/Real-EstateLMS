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

/**
 * Checks if the user has a specific permission.
 * @param array $user The user array returned by requireAuth()
 * @param string $permissionName The permission name (e.g. 'courses:create')
 * @return bool
 */
function hasPermission(array $user, string $permissionName): bool {
    if (empty($user['role'])) {
        return false;
    }
    
    $role = $user['role'];
    
    // Super admin has all permissions
    if ($role === 'super_admin') {
        return true;
    }
    
    try {
        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT COUNT(*) 
            FROM role_permissions rp
            INNER JOIN roles r ON rp.role_id = r.id
            INNER JOIN permissions p ON rp.permission_id = p.id
            WHERE r.name = ? AND p.name = ?
        ");
        $stmt->execute([$role, $permissionName]);
        $count = (int)$stmt->fetchColumn();
        return $count > 0;
    } catch (Exception $e) {
        // Fallback to static mapping in case database is offline or not configured
        $roleToPermissions = [
            'admin' => [
                'users:create', 'users:read', 'users:update',
                'courses:create', 'courses:read', 'courses:update', 'courses:delete',
                'enrollments:create', 'enrollments:read', 'enrollments:update',
                'assignments:create', 'assignments:read', 'assignments:update', 'assignments:delete',
                'submissions:grade', 'submissions:read'
            ],
            'instructor' => [
                'users:read',
                'courses:read', 'courses:update',
                'enrollments:read',
                'assignments:create', 'assignments:read', 'assignments:update',
                'submissions:grade', 'submissions:read'
            ],
            'student' => [
                'courses:read',
                'enrollments:read',
                'assignments:read',
                'submissions:create', 'submissions:read'
            ]
        ];
        
        if (isset($roleToPermissions[$role])) {
            return in_array($permissionName, $roleToPermissions[$role]);
        }
        return false;
    }
}

/**
 * Permission-based authorization gate.
 * Verifies if the authenticated user has the specified permission.
 * @param string $permissionName The required permission
 * @return array The authenticated user details
 */
function requirePermission(string $permissionName): array {
    $user = requireAuth();
    if (!hasPermission($user, $permissionName)) {
        sendResponse(403, null, "Forbidden: You do not have the required access permissions.");
    }
    return $user;
}
