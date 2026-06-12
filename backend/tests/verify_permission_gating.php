<?php
/**
 * Verification Script for Permission-based Gating Helpers
 * Run via: php backend/tests/verify_permission_gating.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/auth_middleware.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "PERMISSION GATING SYSTEM INTEGRITY AUDIT" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

$testsRun = 0;
$testsPassed = 0;

function assertPermissionTest($name, $expression) {
    global $testsRun, $testsPassed;
    $testsRun++;
    if ($expression) {
        $testsPassed++;
        echo GREEN . "  [PASS] " . NC . $name . "\n";
    } else {
        echo RED . "  [FAIL] " . NC . $name . "\n";
    }
}

// 1. Test Super Admin has all permissions
$superAdmin = ['role' => 'super_admin', 'id' => 1];
assertPermissionTest("Super Admin has 'courses:delete' permission", hasPermission($superAdmin, 'courses:delete'));
assertPermissionTest("Super Admin has 'users:delete' permission", hasPermission($superAdmin, 'users:delete'));
assertPermissionTest("Super Admin has 'nonexistent:permission' permission", hasPermission($superAdmin, 'nonexistent:permission'));

// 2. Test Student permissions
$student = ['role' => 'student', 'id' => 2];
assertPermissionTest("Student has 'courses:read' permission", hasPermission($student, 'courses:read'));
assertPermissionTest("Student has 'submissions:create' permission", hasPermission($student, 'submissions:create'));
assertPermissionTest("Student lacks 'courses:delete' permission", !hasPermission($student, 'courses:delete'));
assertPermissionTest("Student lacks 'users:delete' permission", !hasPermission($student, 'users:delete'));

// 3. Test Instructor permissions
$instructor = ['role' => 'instructor', 'id' => 3];
assertPermissionTest("Instructor has 'assignments:create' permission", hasPermission($instructor, 'assignments:create'));
assertPermissionTest("Instructor has 'submissions:grade' permission", hasPermission($instructor, 'submissions:grade'));
assertPermissionTest("Instructor lacks 'users:delete' permission", !hasPermission($instructor, 'users:delete'));

// 4. Test fallback to static mapping when DB has issues / nonexistent roles
$unknownRoleUser = ['role' => 'guest', 'id' => 4];
assertPermissionTest("Guest role has no permissions", !hasPermission($unknownRoleUser, 'courses:read'));

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo "AUDIT COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    exit(0);
} else {
    exit(1);
}
