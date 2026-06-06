<?php
/**
 * Safe Admin & Role Seeding Script (Non-destructive)
 */
require_once __DIR__ . '/db.php';

try {
    $db = Database::getConnection();

    // 1. Create roles table if not exists
    $db->exec("CREATE TABLE IF NOT EXISTS `roles` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(50) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "Table 'roles' verified.<br>";

    // 2. Seed roles
    $roles = ['super_admin', 'admin', 'instructor', 'student'];
    $stmt = $db->prepare("INSERT IGNORE INTO `roles` (`name`) VALUES (?)");
    foreach ($roles as $role) {
        $stmt->execute([$role]);
    }
    echo "Roles seeded.<br>";

    // 3. Alter users table to support the new roles
    $db->exec("ALTER TABLE `users` MODIFY COLUMN `role` ENUM('super_admin', 'admin', 'instructor', 'student') DEFAULT 'student'");
    echo "Table 'users' altered.<br>";

    // 4. Seed admin/superadmin accounts if they don't exist
    $mockUsers = [
        [
            'full_name' => 'Super Admin User',
            'email' => 'superadmin@bgrealtyacademy.com',
            'password' => 'password123',
            'role' => 'super_admin'
        ],
        [
            'full_name' => 'System Admin User',
            'email' => 'admin@bgrealtyacademy.com',
            'password' => 'password123',
            'role' => 'admin'
        ],
        [
            'full_name' => 'Expert Instructor User',
            'email' => 'instructor@bgrealtyacademy.com',
            'password' => 'password123',
            'role' => 'instructor'
        ],
        [
            'full_name' => 'LMS Student User',
            'email' => 'student@bgrealtyacademy.com',
            'password' => 'password123',
            'role' => 'student'
        ]
    ];

    $checkStmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $insertStmt = $db->prepare("INSERT INTO users (full_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, 'Active')");

    foreach ($mockUsers as $mu) {
        $checkStmt->execute([$mu['email']]);
        if (!$checkStmt->fetch()) {
            $hash = password_hash($mu['password'], PASSWORD_BCRYPT);
            $insertStmt->execute([$mu['full_name'], $mu['email'], $hash, $mu['role']]);
            echo "User {$mu['email']} created.<br>";
        } else {
            $db->prepare("UPDATE users SET role = ? WHERE email = ?")->execute([$mu['role'], $mu['email']]);
            echo "User {$mu['email']} already exists. Role updated to {$mu['role']}.<br>";
        }
    }

    echo "<br><strong>Admin & Role Seeding completed successfully!</strong>";
} catch (Exception $e) {
    echo "Seeding failed: " . $e->getMessage();
}
