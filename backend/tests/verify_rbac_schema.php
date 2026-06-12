<?php
/**
 * Automated Verification Script for Roles and Permissions (RBAC) Schema
 * Run via: php backend/tests/verify_rbac_schema.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "ROLES AND PERMISSIONS (RBAC) SCHEMA AUDIT TEST" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

$testsRun = 0;
$testsPassed = 0;
$failures = [];

function rbacTest(string $name, bool $expression, string $failureDetails = '') {
    global $testsRun, $testsPassed, $failures;
    $testsRun++;
    if ($expression) {
        $testsPassed++;
        echo GREEN . "  [PASS] " . NC . $name . "\n";
    } else {
        echo RED . "  [FAIL] " . NC . $name . "\n";
        if ($failureDetails) {
            echo "         Details: " . $failureDetails . "\n";
        }
        $failures[] = $name . ($failureDetails ? " (Details: {$failureDetails})" : "");
    }
}

try {
    $db = Database::getConnection();

    // 1. Table Existence Checks
    $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    rbacTest("Table 'roles' exists", in_array('roles', $tables));
    rbacTest("Table 'permissions' exists", in_array('permissions', $tables));
    rbacTest("Table 'role_permissions' exists", in_array('role_permissions', $tables));

    // 2. Table Column Audits
    if (in_array('roles', $tables)) {
        $cols = $db->query("SHOW COLUMNS FROM `roles`")->fetchAll(PDO::FETCH_COLUMN);
        rbacTest("Table 'roles' has column 'id'", in_array('id', $cols));
        rbacTest("Table 'roles' has column 'name'", in_array('name', $cols));
        rbacTest("Table 'roles' has column 'description'", in_array('description', $cols));
    }

    if (in_array('permissions', $tables)) {
        $cols = $db->query("SHOW COLUMNS FROM `permissions`")->fetchAll(PDO::FETCH_COLUMN);
        rbacTest("Table 'permissions' has column 'id'", in_array('id', $cols));
        rbacTest("Table 'permissions' has column 'name'", in_array('name', $cols));
        rbacTest("Table 'permissions' has column 'description'", in_array('description', $cols));
    }

    if (in_array('role_permissions', $tables)) {
        $cols = $db->query("SHOW COLUMNS FROM `role_permissions`")->fetchAll(PDO::FETCH_COLUMN);
        rbacTest("Table 'role_permissions' has column 'role_id'", in_array('role_id', $cols));
        rbacTest("Table 'role_permissions' has column 'permission_id'", in_array('permission_id', $cols));
    }

    // 3. Constraints and Index Checks
    if (in_array('role_permissions', $tables)) {
        // Validate Primary Key constraint on role_id + permission_id
        $indexes = $db->query("SHOW INDEX FROM `role_permissions`")->fetchAll();
        $hasCompositePK = false;
        $pkColumns = [];
        foreach ($indexes as $idx) {
            if ($idx['Key_name'] === 'PRIMARY') {
                $pkColumns[] = $idx['Column_name'];
            }
        }
        $hasCompositePK = (count($pkColumns) === 2 && in_array('role_id', $pkColumns) && in_array('permission_id', $pkColumns));
        rbacTest("Table 'role_permissions' has composite primary key (role_id, permission_id)", $hasCompositePK);

        // Validate Foreign Keys
        $fkStmt = $db->query("
            SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'role_permissions'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        ");
        $fks = $fkStmt->fetchAll();
        
        $hasRoleFK = false;
        $hasPermFK = false;
        foreach ($fks as $fk) {
            if ($fk['COLUMN_NAME'] === 'role_id' && $fk['REFERENCED_TABLE_NAME'] === 'roles' && $fk['REFERENCED_COLUMN_NAME'] === 'id') {
                $hasRoleFK = true;
            }
            if ($fk['COLUMN_NAME'] === 'permission_id' && $fk['REFERENCED_TABLE_NAME'] === 'permissions' && $fk['REFERENCED_COLUMN_NAME'] === 'id') {
                $hasPermFK = true;
            }
        }
        rbacTest("Table 'role_permissions' has foreign key referencing 'roles' (id)", $hasRoleFK);
        rbacTest("Table 'role_permissions' has foreign key referencing 'permissions' (id)", $hasPermFK);
    }

    // 4. Seeded Data Integrity Audit
    if (in_array('roles', $tables)) {
        $rolesList = $db->query("SELECT name FROM roles")->fetchAll(PDO::FETCH_COLUMN);
        $expectedRoles = ['super_admin', 'admin', 'instructor', 'student'];
        $missingRoles = array_diff($expectedRoles, $rolesList);
        rbacTest("All expected roles are seeded correctly", empty($missingRoles), "Missing roles: " . implode(', ', $missingRoles));
    }

    if (in_array('permissions', $tables)) {
        $permsCount = $db->query("SELECT COUNT(*) FROM permissions")->fetchColumn();
        rbacTest("Permissions table has seeded items (Count: {$permsCount})", $permsCount > 0);
    }

    if (in_array('role_permissions', $tables)) {
        // Test mapping counts for specific roles
        $rolesMap = $db->query("SELECT name, id FROM roles")->fetchAll(PDO::FETCH_KEY_PAIR);
        
        if (isset($rolesMap['super_admin'])) {
            $superAdminId = $rolesMap['super_admin'];
            $superAdminPermsCount = $db->query("SELECT COUNT(*) FROM role_permissions WHERE role_id = {$superAdminId}")->fetchColumn();
            $totalPermsCount = $db->query("SELECT COUNT(*) FROM permissions")->fetchColumn();
            rbacTest("Super Admin role mapped to all {$totalPermsCount} permissions", (int)$superAdminPermsCount === (int)$totalPermsCount);
        } else {
            rbacTest("Super Admin mappings verified", false, "super_admin role not found");
        }

        if (isset($rolesMap['student'])) {
            $studentId = $rolesMap['student'];
            $studentPerms = $db->query("
                SELECT p.name FROM permissions p
                JOIN role_permissions rp ON p.id = rp.permission_id
                WHERE rp.role_id = {$studentId}
            ")->fetchAll(PDO::FETCH_COLUMN);
            
            $expectedStudentPerms = ['courses:read', 'enrollments:read', 'assignments:read', 'submissions:create', 'submissions:read'];
            $missingStudentPerms = array_diff($expectedStudentPerms, $studentPerms);
            rbacTest("Student role has correct access permissions mapping", empty($missingStudentPerms), "Missing student permissions: " . implode(', ', $missingStudentPerms));
        } else {
            rbacTest("Student mappings verified", false, "student role not found");
        }
    }

} catch (Exception $e) {
    rbacTest("Connected to database successfully", false, $e->getMessage());
}

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo "AUDIT RESULTS: " . ($testsPassed === $testsRun ? GREEN : RED) . "{$testsPassed} / {$testsRun} Checks Passed" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    exit(0);
} else {
    echo RED . "Auditing failed on the following checks:\n";
    foreach ($failures as $f) {
        echo " - " . $f . "\n";
    }
    exit(1);
}
