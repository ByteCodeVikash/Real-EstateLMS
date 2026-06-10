<?php
/**
 * Database Migration Script for Admin Authentication & Role Management
 */
require_once __DIR__ . '/db.php';

try {
    $db = Database::getConnection();

    // 1. Create roles table
    $db->exec("CREATE TABLE IF NOT EXISTS `roles` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(50) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "Table 'roles' created/verified.\n";

    // 2. Seed roles table
    $roles = ['super_admin', 'admin', 'instructor', 'student'];
    $stmt = $db->prepare("INSERT IGNORE INTO `roles` (`name`) VALUES (?)");
    foreach ($roles as $role) {
        $stmt->execute([$role]);
    }
    echo "Roles seeded.\n";

    // 3. Alter users table role column to support new roles
    $db->exec("ALTER TABLE `users` MODIFY COLUMN `role` ENUM('super_admin', 'admin', 'instructor', 'student') DEFAULT 'student'");
    echo "Table 'users' altered (role enum updated).\n";

    // 4. Seed mock accounts
    $mockUsers = [
        // bgrealtyacademy.com domain accounts
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
        ],
        // bjrealty.com domain accounts (matching frontend presets)
        [
            'full_name' => 'Super Admin User (BJ)',
            'email' => 'superadmin@bjreality.com',
            'password' => 'password123',
            'role' => 'super_admin'
        ],
        [
            'full_name' => 'System Admin User (BJ)',
            'email' => 'admin@bjreality.com',
            'password' => 'password123',
            'role' => 'admin'
        ],
        [
            'full_name' => 'Expert Instructor User (BJ)',
            'email' => 'instructor@bjreality.com',
            'password' => 'password123',
            'role' => 'instructor'
        ],
        [
            'full_name' => 'LMS Student User (BJ)',
            'email' => 'student@bjreality.com',
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
            echo "Mock user {$mu['email']} created.\n";
        } else {
            $db->prepare("UPDATE users SET role = ? WHERE email = ?")->execute([$mu['role'], $mu['email']]);
            echo "Mock user {$mu['email']} already exists. Role updated to {$mu['role']}.\n";
        }
    }

    // 5. Create categories table
    $db->exec("CREATE TABLE IF NOT EXISTS `categories` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `slug` VARCHAR(100) NOT NULL UNIQUE,
        `description` TEXT DEFAULT NULL,
        `image` VARCHAR(255) DEFAULT NULL,
        `icon` VARCHAR(50) DEFAULT 'Layers',
        `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
        `sort_order` INT NOT NULL DEFAULT 0,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_categories_slug` (`slug`),
        INDEX `idx_categories_status` (`status`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "Table 'categories' created/verified.\n";

    // 6. Seed categories
    $defaultCategories = [
        [
            'name' => 'Luxury Brokerage',
            'slug' => 'luxury-brokerage',
            'description' => 'High-end residential flipping, valuation of premium assets, staging, and elite buyer representation.',
            'icon' => 'Award',
            'status' => 'Active'
        ],
        [
            'name' => 'Underwriting',
            'slug' => 'underwriting',
            'description' => 'Commercial modeling, loan-to-value calculations, debt service coverage ratio analysis, and pro-forma development.',
            'icon' => 'BarChart3',
            'status' => 'Active'
        ],
        [
            'name' => 'Negotiation',
            'slug' => 'negotiation',
            'description' => 'Psychology and tactical mirroring techniques utilized by top 1% agents to capture premium commissions.',
            'icon' => 'Zap',
            'status' => 'Active'
        ],
        [
            'name' => 'Syndication',
            'slug' => 'syndication',
            'description' => 'Sourcing multifamily deals, legal structures under SEC Regulation D, and capital raising techniques.',
            'icon' => 'Users',
            'status' => 'Active'
        ]
    ];

    $checkCat = $db->prepare("SELECT id FROM categories WHERE slug = ?");
    $insertCat = $db->prepare("INSERT INTO categories (name, slug, description, image, icon, status, sort_order) VALUES (?, ?, ?, NULL, ?, ?, 0)");

    foreach ($defaultCategories as $cat) {
        $checkCat->execute([$cat['slug']]);
        if (!$checkCat->fetch()) {
            $insertCat->execute([$cat['name'], $cat['slug'], $cat['description'], $cat['icon'], $cat['status']]);
            echo "Category '{$cat['name']}' seeded.\n";
        } else {
            echo "Category '{$cat['name']}' already exists.\n";
        }
    }

    // Recreate the courses table to apply updated schema
    echo "Recreating courses table...\n";
    $db->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $db->exec("DROP TABLE IF EXISTS `courses`;");
    $db->exec("CREATE TABLE `courses` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `category_id` INT DEFAULT NULL,
        `title` VARCHAR(255) NOT NULL,
        `slug` VARCHAR(255) NOT NULL UNIQUE,
        `description` TEXT DEFAULT NULL,
        `thumbnail` VARCHAR(255) DEFAULT NULL,
        `mentor_name` VARCHAR(100) NOT NULL,
        `duration` VARCHAR(50) DEFAULT NULL,
        `price` DECIMAL(10, 2) DEFAULT 0.00,
        `status` ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
        `created_by` INT DEFAULT NULL,
        `curriculum` LONGTEXT DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT `fk_courses_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
        CONSTRAINT `fk_courses_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
        INDEX `idx_courses_status` (`status`),
        INDEX `idx_courses_category_id` (`category_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    $db->exec("SET FOREIGN_KEY_CHECKS = 1;");
    echo "Courses table recreated successfully.\n";

    // Find Category IDs
    $stmtCat = $db->prepare("SELECT id FROM categories WHERE name = ?");
    $stmtCat->execute(['Luxury Brokerage']);
    $luxuryCatId = $stmtCat->fetchColumn() ?: null;

    $stmtCat->execute(['Underwriting']);
    $underwritingCatId = $stmtCat->fetchColumn() ?: null;

    // Find User IDs
    $stmtUser = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmtUser->execute(['admin@bgrealtyacademy.com']);
    $adminUserId = $stmtUser->fetchColumn() ?: null;

    $stmtUser->execute(['instructor@bgrealtyacademy.com']);
    $instructorUserId = $stmtUser->fetchColumn() ?: null;

    // Seed default courses
    echo "Seeding courses...\n";
    $defaultCourses = [
        [
            'category_id' => $luxuryCatId,
            'title' => 'Luxury Flipping Masterclass',
            'slug' => 'luxury-flipping-masterclass',
            'description' => 'Learn to identify undervalued luxury assets, negotiate premium acquisition prices, manage high-end rehab designs, and stage properties to secure maximum ROI.',
            'thumbnail' => 'grad-violet',
            'mentor_name' => 'Sarah Jenkins',
            'duration' => '12 Weeks',
            'price' => 1499.00,
            'status' => 'Published',
            'created_by' => $adminUserId,
            'curriculum' => json_encode([
                [
                    'id' => 'mod-1-1',
                    'title' => 'Module 1: High-End Comparables & Analysis',
                    'lectures' => [
                        ['id' => 'lec-1-1', 'title' => 'Identifying Affluent Demographics', 'duration' => '18m', 'type' => 'video'],
                        ['id' => 'lec-1-2', 'title' => 'Analyzing Premium Upgrades ROI', 'duration' => '25m', 'type' => 'video'],
                        ['id' => 'lec-1-3', 'title' => 'Luxury Comp Valuation Sheet', 'duration' => '10m', 'type' => 'document']
                    ]
                ],
                [
                    'id' => 'mod-1-2',
                    'title' => 'Module 2: High-End Renovations & Contractor Deals',
                    'lectures' => [
                        ['id' => 'lec-1-4', 'title' => 'Negotiating with Elite Subcontractors', 'duration' => '32m', 'type' => 'video'],
                        ['id' => 'lec-1-5', 'title' => 'Material Sourcing & Staging Blueprints', 'duration' => '45m', 'type' => 'video']
                    ]
                ]
            ])
        ],
        [
            'category_id' => $underwritingCatId,
            'title' => 'Commercial Underwriting & Modeling',
            'slug' => 'commercial-underwriting-modeling',
            'description' => 'Master the financial tools required to evaluate office spaces, industrial buildings, and retail strip centers. Build models for pro-forma calculations.',
            'thumbnail' => 'grad-blue',
            'mentor_name' => 'Alex Mercer',
            'duration' => '10 Weeks',
            'price' => 2100.00,
            'status' => 'Published',
            'created_by' => $instructorUserId,
            'curriculum' => json_encode([
                [
                    'id' => 'mod-2-1',
                    'title' => 'Module 1: Commercial Asset Classes Overview',
                    'lectures' => [
                        ['id' => 'lec-2-1', 'title' => 'Triple Net (NNN) Leases Demystified', 'duration' => '20m', 'type' => 'video'],
                        ['id' => 'lec-2-2', 'title' => 'CAP Rates vs Cash-on-Cash Return', 'duration' => '35m', 'type' => 'video']
                    ]
                ]
            ])
        ]
    ];

    $insertCourse = $db->prepare("INSERT INTO courses (category_id, title, slug, description, thumbnail, mentor_name, duration, price, status, created_by, curriculum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($defaultCourses as $course) {
        $insertCourse->execute([
            $course['category_id'],
            $course['title'],
            $course['slug'],
            $course['description'],
            $course['thumbnail'],
            $course['mentor_name'],
            $course['duration'],
            $course['price'],
            $course['status'],
            $course['created_by'],
            $course['curriculum']
        ]);
        echo "Course '{$course['title']}' seeded.\n";
    }

    // 7. Create course_modules table
    $db->exec("CREATE TABLE IF NOT EXISTS `course_modules` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `course_id` INT NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT DEFAULT NULL,
        `sort_order` INT NOT NULL DEFAULT 0,
        `lectures` LONGTEXT DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT `fk_modules_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
        INDEX `idx_modules_course` (`course_id`),
        INDEX `idx_modules_sort` (`sort_order`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "Table 'course_modules' created/verified.\n";

    // 8. Migrate existing course curriculum to course_modules
    $coursesQuery = $db->query("SELECT id, title, curriculum FROM courses");
    $insertModule = $db->prepare("INSERT INTO course_modules (course_id, title, sort_order, lectures) VALUES (?, ?, ?, ?)");
    $checkModule = $db->prepare("SELECT COUNT(*) FROM course_modules WHERE course_id = ?");

    while ($row = $coursesQuery->fetch(PDO::FETCH_ASSOC)) {
        $checkModule->execute([$row['id']]);
        $hasModules = $checkModule->fetchColumn() > 0;
        if (!$hasModules && !empty($row['curriculum'])) {
            $curriculum = json_decode($row['curriculum'], true);
            if (is_array($curriculum)) {
                $sort = 1;
                foreach ($curriculum as $mod) {
                    $modTitle = $mod['title'] ?? 'Untitled Section';
                    $modLectures = isset($mod['lectures']) ? json_encode($mod['lectures']) : '[]';
                    $insertModule->execute([$row['id'], $modTitle, $sort++, $modLectures]);
                }
                echo "Migrated curriculum for course: {$row['title']}\n";
            }
        }
    }

    // 9. Create lectures table
    $db->exec("CREATE TABLE IF NOT EXISTS `lectures` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `module_id` INT NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT DEFAULT NULL,
        `video_url` VARCHAR(255) DEFAULT NULL,
        `duration` VARCHAR(50) DEFAULT NULL,
        `sort_order` INT NOT NULL DEFAULT 0,
        `is_preview` TINYINT(1) DEFAULT 0,
        `video_type` VARCHAR(50) DEFAULT 'html5',
        `video_id` VARCHAR(255) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT `fk_lectures_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE CASCADE,
        INDEX `idx_lectures_module` (`module_id`),
        INDEX `idx_lectures_sort` (`sort_order`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    echo "Table 'lectures' created/verified.\n";

    // 10. Migrate course_modules lectures JSON to lectures table
    $modulesQuery = $db->query("SELECT id, title, lectures FROM course_modules");
    $insertLecture = $db->prepare("INSERT INTO lectures (module_id, title, duration, video_url, sort_order, is_preview, video_type, video_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $checkLectures = $db->prepare("SELECT COUNT(*) FROM lectures WHERE module_id = ?");

    while ($modRow = $modulesQuery->fetch(PDO::FETCH_ASSOC)) {
        $checkLectures->execute([$modRow['id']]);
        $hasLectures = $checkLectures->fetchColumn() > 0;
        if (!$hasLectures && !empty($modRow['lectures'])) {
            $lectures = json_decode($modRow['lectures'], true);
            if (is_array($lectures)) {
                $sort = 1;
                foreach ($lectures as $lec) {
                    $lecTitle = $lec['title'] ?? 'Untitled Lesson';
                    $lecDuration = $lec['duration'] ?? '15m';
                    $lecType = $lec['type'] ?? 'video';
                    $videoUrl = $lecType === 'video' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : null;
                    $isPreview = isset($lec['is_preview']) ? (int)$lec['is_preview'] : 0;
                    $videoType = 'html5';
                    $videoId = 'bbb-mock';
                    
                    $insertLecture->execute([
                        $modRow['id'],
                        $lecTitle,
                        $lecDuration,
                        $videoUrl,
                        $sort++,
                        $isPreview,
                        $videoType,
                        $videoId
                    ]);
                }
                echo "Migrated lectures for module ID: {$modRow['id']} - {$modRow['title']}\n";
            }
        }
    }

    // 11. Create enrollments table
    echo "Recreating enrollments table...\n";
    $db->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $db->exec("DROP TABLE IF EXISTS `enrollments`;");
    $db->exec("CREATE TABLE `enrollments` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `course_id` INT NOT NULL,
        `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `progress` INT DEFAULT 0,
        `completion_status` ENUM('Active', 'Completed', 'Dropped') DEFAULT 'Active',
        `certificate_issued` TINYINT(1) DEFAULT 0,
        UNIQUE KEY `uk_user_course` (`user_id`, `course_id`),
        CONSTRAINT `fk_enrollments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
        CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
        INDEX `idx_enrollments_user` (`user_id`),
        INDEX `idx_enrollments_course` (`course_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    $db->exec("SET FOREIGN_KEY_CHECKS = 1;");
    echo "Enrollments table created.\n";

    // Seed mock enrollments for student@bgrealtyacademy.com
    $stmtUser->execute(['student@bgrealtyacademy.com']);
    $studentUserId = $stmtUser->fetchColumn() ?: null;

    if ($studentUserId) {
        $coursesQuery = $db->query("SELECT id, title FROM courses WHERE status = 'Published'");
        $courses = $coursesQuery->fetchAll(PDO::FETCH_ASSOC);
        
        $insertEnrollment = $db->prepare("INSERT IGNORE INTO enrollments (user_id, course_id, progress, completion_status, certificate_issued) VALUES (?, ?, ?, ?, ?)");
        
        $i = 0;
        $progresses = [75, 40, 90, 0];
        foreach ($courses as $c) {
            $prog = $progresses[$i % count($progresses)];
            $status = ($prog == 100) ? 'Completed' : 'Active';
            $cert = ($prog == 100) ? 1 : 0;
            $insertEnrollment->execute([$studentUserId, $c['id'], $prog, $status, $cert]);
            echo "Seeded enrollment for Student in course '{$c['title']}' with {$prog}% progress.\n";
            $i++;
        }
    }

    // 12. Create assignments and assignment_submissions tables
    echo "Recreating assignments and assignment_submissions tables...\n";
    $db->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $db->exec("DROP TABLE IF EXISTS `assignment_submissions`;");
    $db->exec("DROP TABLE IF EXISTS `assignments`;");
    
    $db->exec("CREATE TABLE `assignments` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `course_id` INT NOT NULL,
        `module_id` INT DEFAULT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT DEFAULT NULL,
        `instructions` TEXT DEFAULT NULL,
        `due_date` DATETIME DEFAULT NULL,
        `max_marks` INT NOT NULL DEFAULT 100,
        `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft',
        `created_by` INT NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT `fk_assignments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
        CONSTRAINT `fk_assignments_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE SET NULL,
        CONSTRAINT `fk_assignments_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
        INDEX `idx_assignments_course` (`course_id`),
        INDEX `idx_assignments_module` (`module_id`),
        INDEX `idx_assignments_creator` (`created_by`),
        INDEX `idx_assignments_status` (`status`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $db->exec("CREATE TABLE `assignment_submissions` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `assignment_id` INT NOT NULL,
        `student_id` INT NOT NULL,
        `file_path` VARCHAR(255) NOT NULL,
        `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `marks` INT DEFAULT NULL,
        `feedback` TEXT DEFAULT NULL,
        `status` ENUM('Submitted', 'Under Review', 'Graded', 'Revision Requested') NOT NULL DEFAULT 'Submitted',
        `graded_by` INT DEFAULT NULL,
        `graded_at` TIMESTAMP DEFAULT NULL,
        CONSTRAINT `fk_submissions_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
        CONSTRAINT `fk_submissions_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
        CONSTRAINT `fk_submissions_grader` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
        INDEX `idx_submissions_assignment` (`assignment_id`),
        INDEX `idx_submissions_student` (`student_id`),
        INDEX `idx_submissions_grader` (`graded_by`),
        INDEX `idx_submissions_status` (`status`),
        UNIQUE KEY `uk_student_assignment` (`student_id`, `assignment_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    
    $db->exec("SET FOREIGN_KEY_CHECKS = 1;");
    echo "Assignments and submissions tables recreated successfully.\n";

    // 13. Seed mock assignments and submissions
    echo "Seeding assignments and submissions...\n";
    
    // Find Luxury Flipping Course ID
    $stmtCourse = $db->prepare("SELECT id FROM courses WHERE slug = ?");
    $stmtCourse->execute(['luxury-flipping-masterclass']);
    $luxuryCourseId = $stmtCourse->fetchColumn() ?: null;

    if ($luxuryCourseId) {
        // Find Module IDs
        $stmtModule = $db->prepare("SELECT id FROM course_modules WHERE course_id = ? ORDER BY sort_order ASC");
        $stmtModule->execute([$luxuryCourseId]);
        $modules = $stmtModule->fetchAll(PDO::FETCH_COLUMN);
        
        $module1Id = $modules[0] ?? null;
        $module2Id = $modules[1] ?? null;

        // Find users
        $stmtUser->execute(['instructor@bgrealtyacademy.com']);
        $instructorId = $stmtUser->fetchColumn() ?: null;

        $stmtUser->execute(['student@bgrealtyacademy.com']);
        $studentId = $stmtUser->fetchColumn() ?: null;

        $stmtUser->execute(['admin@bgrealtyacademy.com']);
        $adminId = $stmtUser->fetchColumn() ?: null;

        if ($instructorId && $studentId) {
            // Seed Assignment 1: Luxury Asset Evaluation Report (Published)
            $dueDate1 = date('Y-m-d H:i:s', strtotime('+7 days'));
            $insertAssign = $db->prepare("INSERT INTO assignments (course_id, module_id, title, description, instructions, due_date, max_marks, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $insertAssign->execute([
                $luxuryCourseId,
                $module1Id,
                'Luxury Asset Evaluation Report',
                'Submit a comprehensive comparative market analysis (CMA) report for the 5-bedroom luxury estate listed in Module 1.',
                'Ensure you include at least 3 comparable property sales within the last 6 months, apply adjustment factors for premium finishes, and present a final valuation with detailed justification. Upload in PDF format.',
                $dueDate1,
                100,
                'Published',
                $instructorId
            ]);
            $assignment1Id = $db->lastInsertId();
            echo "Seeded published assignment 'Luxury Asset Evaluation Report'.\n";

            // Seed Assignment 2: Contractor Negotiation Script (Draft)
            $dueDate2 = date('Y-m-d H:i:s', strtotime('+14 days'));
            $insertAssign->execute([
                $luxuryCourseId,
                $module2Id,
                'Contractor Negotiation Script',
                'Draft a tactical negotiation plan and word-for-word dialogue script for pitching high-end remodel contractors.',
                'Integrate mirroring, labeling, and calibrated questions. Identify at least 3 potential concessions you are willing to offer. Draft format.',
                $dueDate2,
                50,
                'Draft',
                $instructorId
            ]);
            echo "Seeded draft assignment 'Contractor Negotiation Script'.\n";

            // Seed Submission for Assignment 1
            if ($assignment1Id) {
                $insertSubmission = $db->prepare("INSERT INTO assignment_submissions (assignment_id, student_id, file_path, status, submitted_at) VALUES (?, ?, ?, 'Submitted', ?)");
                $submittedAt = date('Y-m-d H:i:s', strtotime('-1 day'));
                $insertSubmission->execute([
                    $assignment1Id,
                    $studentId,
                    '/uploads/submissions/student_cma_report.pdf',
                    $submittedAt
                ]);
                echo "Seeded mock submission for 'Luxury Asset Evaluation Report'.\n";
            }
        }
    }

    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
