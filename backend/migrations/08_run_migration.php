<?php
/**
 * Migration 08: Audit and update Roles and Permissions Schema
 * Add description column to roles
 * Create permissions and role_permissions tables with proper constraints and indexes
 * Seed default roles and permissions
 * Run via: php backend/migrations/08_run_migration.php
 */

require_once __DIR__ . '/../config/db.php';

try {
    echo "Connecting to the database...\n";
    $db = Database::getConnection();

    // 1. Audit roles table
    echo "Checking roles table...\n";
    $tableCheck = $db->query("SHOW TABLES LIKE 'roles'");
    if ($tableCheck->rowCount() == 0) {
        echo "Creating roles table...\n";
        $db->exec("CREATE TABLE `roles` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(50) NOT NULL,
            UNIQUE KEY `name` (`name`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        echo "Table 'roles' created.\n";
    }

    $columns = $db->query("SHOW COLUMNS FROM `roles`")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('description', $columns)) {
        echo "Adding column 'description' to roles table...\n";
        $db->exec("ALTER TABLE `roles` ADD COLUMN `description` VARCHAR(255) DEFAULT NULL AFTER `name`");
        echo "Column 'description' added.\n";
    } else {
        echo "Column 'description' already exists in roles table.\n";
    }

    // 2. Audit/create permissions table
    echo "Checking permissions table...\n";
    $permissionsTableCheck = $db->query("SHOW TABLES LIKE 'permissions'");
    if ($permissionsTableCheck->rowCount() == 0) {
        echo "Creating permissions table...\n";
        $db->exec("CREATE TABLE `permissions` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `description` VARCHAR(255) DEFAULT NULL,
            UNIQUE KEY `name` (`name`),
            INDEX `idx_permissions_name` (`name`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        echo "Table 'permissions' created.\n";
    } else {
        echo "Table 'permissions' already exists.\n";
        // Ensure name has a unique index and description exists
        $permColumns = $db->query("SHOW COLUMNS FROM `permissions`")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('description', $permColumns)) {
            $db->exec("ALTER TABLE `permissions` ADD COLUMN `description` VARCHAR(255) DEFAULT NULL");
        }
    }

    // 3. Audit/create role_permissions table
    echo "Checking role_permissions table...\n";
    $rolePermissionsTableCheck = $db->query("SHOW TABLES LIKE 'role_permissions'");
    if ($rolePermissionsTableCheck->rowCount() == 0) {
        echo "Creating role_permissions table...\n";
        $db->exec("CREATE TABLE `role_permissions` (
            `role_id` INT NOT NULL,
            `permission_id` INT NOT NULL,
            PRIMARY KEY (`role_id`, `permission_id`),
            CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
            CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
            INDEX `idx_role_permissions_role` (`role_id`),
            INDEX `idx_role_permissions_permission` (`permission_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        echo "Table 'role_permissions' created.\n";
    } else {
        echo "Table 'role_permissions' already exists.\n";
    }

    // 4. Seed default roles and description updates
    echo "Seeding/updating default roles...\n";
    $defaultRoles = [
        'super_admin' => 'Full system administrator with all access privileges.',
        'admin'       => 'Administrator to manage courses, enrollments, and instructors.',
        'instructor'  => 'Instructor with access to manage assignments, view courses, and grade submissions.',
        'student'     => 'Student with access to view courses, take assignments, and view grades.'
    ];

    $stmtRoleSelect = $db->prepare("SELECT id FROM roles WHERE name = ?");
    $stmtRoleInsert = $db->prepare("INSERT INTO roles (name, description) VALUES (?, ?)");
    $stmtRoleUpdate = $db->prepare("UPDATE roles SET description = ? WHERE name = ?");

    foreach ($defaultRoles as $name => $desc) {
        $stmtRoleSelect->execute([$name]);
        if ($stmtRoleSelect->rowCount() == 0) {
            $stmtRoleInsert->execute([$name, $desc]);
            echo "Seeded role: {$name}\n";
        } else {
            $stmtRoleUpdate->execute([$desc, $name]);
            echo "Updated description for role: {$name}\n";
        }
    }

    // 5. Seed default permissions
    echo "Seeding default permissions...\n";
    $defaultPermissions = [
        ['name' => 'users:create', 'description' => 'Create new user accounts'],
        ['name' => 'users:read', 'description' => 'View user account details'],
        ['name' => 'users:update', 'description' => 'Modify user account details'],
        ['name' => 'users:delete', 'description' => 'Delete user accounts'],
        
        ['name' => 'courses:create', 'description' => 'Create new courses'],
        ['name' => 'courses:read', 'description' => 'View courses'],
        ['name' => 'courses:update', 'description' => 'Modify existing courses'],
        ['name' => 'courses:delete', 'description' => 'Delete courses'],
        
        ['name' => 'enrollments:create', 'description' => 'Enroll users in courses'],
        ['name' => 'enrollments:read', 'description' => 'View course enrollments'],
        ['name' => 'enrollments:update', 'description' => 'Modify course enrollment status'],
        ['name' => 'enrollments:delete', 'description' => 'Remove course enrollments'],
        
        ['name' => 'assignments:create', 'description' => 'Create course assignments'],
        ['name' => 'assignments:read', 'description' => 'View assignments and submissions'],
        ['name' => 'assignments:update', 'description' => 'Modify assignments'],
        ['name' => 'assignments:delete', 'description' => 'Delete assignments'],
        
        ['name' => 'submissions:create', 'description' => 'Submit homework / assignments'],
        ['name' => 'submissions:grade', 'description' => 'Grade and provide feedback on assignment submissions'],
        ['name' => 'submissions:read', 'description' => 'View assignment submissions'],
    ];

    $stmtPermSelect = $db->prepare("SELECT id FROM permissions WHERE name = ?");
    $stmtPermInsert = $db->prepare("INSERT INTO permissions (name, description) VALUES (?, ?)");
    $stmtPermUpdate = $db->prepare("UPDATE permissions SET description = ? WHERE name = ?");

    foreach ($defaultPermissions as $perm) {
        $stmtPermSelect->execute([$perm['name']]);
        if ($stmtPermSelect->rowCount() == 0) {
            $stmtPermInsert->execute([$perm['name'], $perm['description']]);
            echo "Seeded permission: {$perm['name']}\n";
        } else {
            $stmtPermUpdate->execute([$perm['description'], $perm['name']]);
            echo "Updated permission description: {$perm['name']}\n";
        }
    }

    // 6. Map Roles to Permissions
    echo "Configuring role-permission mappings...\n";
    
    // Fetch all roles & permissions to map ids
    $rolesMap = $db->query("SELECT name, id FROM roles")->fetchAll(PDO::FETCH_KEY_PAIR);
    $permissionsMap = $db->query("SELECT name, id FROM permissions")->fetchAll(PDO::FETCH_KEY_PAIR);

    $roleToPermissions = [
        'super_admin' => array_keys($permissionsMap), // Super admin gets all permissions
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

    $stmtMappingInsert = $db->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)");

    foreach ($roleToPermissions as $roleName => $permsList) {
        if (!isset($rolesMap[$roleName])) {
            echo "Warning: Role {$roleName} not found in roles table. Skipping mapping.\n";
            continue;
        }
        $roleId = $rolesMap[$roleName];
        
        foreach ($permsList as $permName) {
            if (!isset($permissionsMap[$permName])) {
                echo "Warning: Permission {$permName} not found in permissions table. Skipping mapping.\n";
                continue;
            }
            $permId = $permissionsMap[$permName];
            $stmtMappingInsert->execute([$roleId, $permId]);
        }
        echo "Mapped permissions for role: {$roleName}\n";
    }

    echo "Migration 08 applied successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
