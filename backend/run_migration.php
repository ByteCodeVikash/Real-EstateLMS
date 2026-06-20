<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Security Key Check
if (!isset($_GET['key']) || $_GET['key'] !== 'debug123') {
    die("Unauthorized access.");
}

define('SECURE_ENTRY', true);
require_once __DIR__ . '/config/config.php';

$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => DB_HOST === '127.0.0.1' ? PDO::FETCH_ASSOC : PDO::FETCH_ASSOC,
];

try {
    $db = null;
    try {
        $db = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        $fallbackPass = defined('DB_PASS_FALLBACK') ? DB_PASS_FALLBACK : '';
        if ($fallbackPass !== '' && $fallbackPass !== DB_PASS) {
            $db = new PDO($dsn, DB_USER, $fallbackPass, $options);
        } else {
            throw $e;
        }
    }
} catch (Exception $e) {
    die("Database Connection Error: " . $e->getMessage());
}

// Disable foreign key checks temporarily for safe schema modifications
$db->exec("SET FOREIGN_KEY_CHECKS = 0;");

$outputs = [];

function tableExists($db, $tableName) {
    try {
        $stmt = $db->query("SHOW TABLES LIKE '$tableName'");
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        return false;
    }
}

function columnExists($db, $tableName, $columnName) {
    try {
        $stmt = $db->query("SHOW COLUMNS FROM `$tableName` LIKE '$columnName'");
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        return false;
    }
}

function logProgress(&$outputs, $message, $success = true) {
    $outputs[] = [
        'message' => $message,
        'success' => $success
    ];
}

// 1. Create categories table
if (!tableExists($db, 'categories')) {
    $sql = "CREATE TABLE `categories` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->exec($sql);
    logProgress($outputs, "Created table 'categories'");
} else {
    logProgress($outputs, "Table 'categories' already exists");
}

// 2. Create course_modules table
if (!tableExists($db, 'course_modules')) {
    $sql = "CREATE TABLE `course_modules` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `course_id` INT NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT DEFAULT NULL,
        `sort_order` INT NOT NULL DEFAULT 0,
        `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft',
        `lectures` LONGTEXT DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_modules_course` (`course_id`),
        INDEX `idx_modules_sort` (`sort_order`),
        INDEX `idx_modules_course_sort` (`course_id`, `sort_order`),
        INDEX `idx_modules_course_status` (`course_id`, `status`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->exec($sql);
    logProgress($outputs, "Created table 'course_modules'");
} else {
    logProgress($outputs, "Table 'course_modules' already exists");
}

// 3. Create lectures table
if (!tableExists($db, 'lectures')) {
    $sql = "CREATE TABLE `lectures` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `module_id` INT NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT DEFAULT NULL,
        `video_url` VARCHAR(255) DEFAULT NULL,
        `duration` VARCHAR(50) DEFAULT NULL,
        `sort_order` INT NOT NULL DEFAULT 0,
        `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft',
        `is_preview` TINYINT(1) DEFAULT 0,
        `video_type` VARCHAR(50) DEFAULT 'html5',
        `video_id` VARCHAR(255) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_lectures_module` (`module_id`),
        INDEX `idx_lectures_sort` (`sort_order`),
        INDEX `idx_lectures_module_sort` (`module_id`, `sort_order`),
        INDEX `idx_lectures_module_status` (`module_id`, `status`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->exec($sql);
    logProgress($outputs, "Created table 'lectures'");
} else {
    logProgress($outputs, "Table 'lectures' already exists");
}

// 4. Create announcements table
if (!tableExists($db, 'announcements')) {
    $sql = "CREATE TABLE `announcements` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `course_id` INT NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `content` TEXT NOT NULL,
        `created_by` INT NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_announcements_course` (`course_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->exec($sql);
    logProgress($outputs, "Created table 'announcements'");
} else {
    logProgress($outputs, "Table 'announcements' already exists");
}

// 5. Create course_resources table
if (!tableExists($db, 'course_resources')) {
    $sql = "CREATE TABLE `course_resources` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `course_id` INT NOT NULL,
        `module_id` INT DEFAULT NULL,
        `title` VARCHAR(255) NOT NULL,
        `file_path` VARCHAR(255) NOT NULL,
        `file_type` VARCHAR(50) DEFAULT NULL,
        `file_size` VARCHAR(50) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_resources_course` (`course_id`),
        INDEX `idx_resources_module` (`module_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->exec($sql);
    logProgress($outputs, "Created table 'course_resources'");
} else {
    logProgress($outputs, "Table 'course_resources' already exists");
}

// 6. Create lecture_progress table
if (!tableExists($db, 'lecture_progress')) {
    $sql = "CREATE TABLE `lecture_progress` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `lecture_id` INT NOT NULL,
        `playhead_seconds` INT DEFAULT 0,
        `duration_seconds` INT DEFAULT 0,
        `is_completed` TINYINT(1) DEFAULT 0,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY `uk_user_lecture` (`user_id`, `lecture_id`),
        INDEX `idx_progress_user` (`user_id`),
        INDEX `idx_progress_lecture` (`lecture_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->exec($sql);
    logProgress($outputs, "Created table 'lecture_progress'");
} else {
    logProgress($outputs, "Table 'lecture_progress' already exists");
}

// 7. Alter users table columns
if (tableExists($db, 'users')) {
    if (!columnExists($db, 'users', 'google_id')) {
        $db->exec("ALTER TABLE `users` ADD COLUMN `google_id` VARCHAR(255) DEFAULT NULL AFTER `password_hash`");
        $db->exec("ALTER TABLE `users` ADD UNIQUE KEY `uk_users_google_id` (`google_id`)");
        logProgress($outputs, "Added column 'google_id' to 'users'");
    }
    if (!columnExists($db, 'users', 'avatar_url')) {
        $db->exec("ALTER TABLE `users` ADD COLUMN `avatar_url` VARCHAR(255) DEFAULT NULL AFTER `google_id`");
        logProgress($outputs, "Added column 'avatar_url' to 'users'");
    }
    if (!columnExists($db, 'users', 'auth_provider')) {
        $db->exec("ALTER TABLE `users` ADD COLUMN `auth_provider` VARCHAR(50) DEFAULT 'local' AFTER `updated_at`");
        logProgress($outputs, "Added column 'auth_provider' to 'users'");
    }
    if (!columnExists($db, 'users', 'reset_token')) {
        $db->exec("ALTER TABLE `users` ADD COLUMN `reset_token` VARCHAR(255) DEFAULT NULL");
        logProgress($outputs, "Added column 'reset_token' to 'users'");
    }
    if (!columnExists($db, 'users', 'reset_token_expires')) {
        $db->exec("ALTER TABLE `users` ADD COLUMN `reset_token_expires` DATETIME DEFAULT NULL");
        logProgress($outputs, "Added column 'reset_token_expires' to 'users'");
    }
}

// 8. Alter admins table columns
if (tableExists($db, 'admins')) {
    if (!columnExists($db, 'admins', 'full_name')) {
        $db->exec("ALTER TABLE `admins` ADD COLUMN `full_name` VARCHAR(255) NOT NULL AFTER `id`");
        logProgress($outputs, "Added column 'full_name' to 'admins'");
    }
    if (!columnExists($db, 'admins', 'status')) {
        $db->exec("ALTER TABLE `admins` ADD COLUMN `status` ENUM('Active', 'Inactive') DEFAULT 'Active' AFTER `password_hash`");
        logProgress($outputs, "Added column 'status' to 'admins'");
    }
    if (!columnExists($db, 'admins', 'reset_token')) {
        $db->exec("ALTER TABLE `admins` ADD COLUMN `reset_token` VARCHAR(255) DEFAULT NULL");
        logProgress($outputs, "Added column 'reset_token' to 'admins'");
    }
    if (!columnExists($db, 'admins', 'reset_token_expires')) {
        $db->exec("ALTER TABLE `admins` ADD COLUMN `reset_token_expires` DATETIME DEFAULT NULL");
        logProgress($outputs, "Added column 'reset_token_expires' to 'admins'");
    }
}

// 9. Alter courses table columns
if (tableExists($db, 'courses')) {
    if (!columnExists($db, 'courses', 'category_id')) {
        $db->exec("ALTER TABLE `courses` ADD COLUMN `category_id` INT DEFAULT NULL AFTER `id`");
        logProgress($outputs, "Added column 'category_id' to 'courses'");
    }
    if (!columnExists($db, 'courses', 'slug')) {
        $db->exec("ALTER TABLE `courses` ADD COLUMN `slug` VARCHAR(255) NOT NULL UNIQUE AFTER `title`");
        logProgress($outputs, "Added column 'slug' to 'courses'");
    }
    if (!columnExists($db, 'courses', 'mentor_name')) {
        $db->exec("ALTER TABLE `courses` ADD COLUMN `mentor_name` VARCHAR(255) DEFAULT NULL AFTER `slug`");
        logProgress($outputs, "Added column 'mentor_name' to 'courses'");
    }
    if (!columnExists($db, 'courses', 'price')) {
        $db->exec("ALTER TABLE `courses` ADD COLUMN `price` DECIMAL(10,2) DEFAULT 0.00 AFTER `mentor_name`");
        logProgress($outputs, "Added column 'price' to 'courses'");
    }
    if (!columnExists($db, 'courses', 'status')) {
        $db->exec("ALTER TABLE `courses` ADD COLUMN `status` ENUM('Active', 'Inactive') DEFAULT 'Active' AFTER `price`");
        logProgress($outputs, "Added column 'status' to 'courses'");
    }
    if (!columnExists($db, 'courses', 'created_by')) {
        $db->exec("ALTER TABLE `courses` ADD COLUMN `created_by` INT DEFAULT NULL AFTER `status`");
        logProgress($outputs, "Added column 'created_by' to 'courses'");
    }
}

// 10. Alter assignments table columns
if (tableExists($db, 'assignments')) {
    if (!columnExists($db, 'assignments', 'module_id')) {
        $db->exec("ALTER TABLE `assignments` ADD COLUMN `module_id` INT DEFAULT NULL AFTER `course_id`");
        logProgress($outputs, "Added column 'module_id' to 'assignments'");
    }
    if (!columnExists($db, 'assignments', 'max_marks')) {
        $db->exec("ALTER TABLE `assignments` ADD COLUMN `max_marks` INT NOT NULL DEFAULT 100 AFTER `title`");
        logProgress($outputs, "Added column 'max_marks' to 'assignments'");
    }
    if (!columnExists($db, 'assignments', 'status')) {
        $db->exec("ALTER TABLE `assignments` ADD COLUMN `status` ENUM('Active', 'Inactive') DEFAULT 'Active' AFTER `max_marks`");
        logProgress($outputs, "Added column 'status' to 'assignments'");
    }
}

// 11. Alter assignment_submissions table columns
if (tableExists($db, 'assignment_submissions')) {
    // Update status enum
    $db->exec("ALTER TABLE `assignment_submissions` MODIFY COLUMN `status` ENUM('Submitted', 'Under Review', 'Graded', 'Revision Requested') NOT NULL DEFAULT 'Submitted'");
    logProgress($outputs, "Updated 'status' enum in 'assignment_submissions'");
}

// 12. Alter webinars table columns
if (tableExists($db, 'webinars')) {
    if (!columnExists($db, 'webinars', 'meeting_id')) {
        $db->exec("ALTER TABLE `webinars` ADD COLUMN `meeting_id` VARCHAR(100) DEFAULT NULL AFTER `title`");
        logProgress($outputs, "Added column 'meeting_id' to 'webinars'");
    }
    if (!columnExists($db, 'webinars', 'recording_url')) {
        $db->exec("ALTER TABLE `webinars` ADD COLUMN `recording_url` VARCHAR(255) DEFAULT NULL AFTER `meeting_id`");
        logProgress($outputs, "Added column 'recording_url' to 'webinars'");
    }
    if (!columnExists($db, 'webinars', 'status')) {
        $db->exec("ALTER TABLE `webinars` ADD COLUMN `status` ENUM('Upcoming', 'Live', 'Completed', 'Cancelled') DEFAULT 'Upcoming' AFTER `recording_url`");
        logProgress($outputs, "Added column 'status' to 'webinars'");
    }
}

// 13. Create certificates table (if not exists) then alter columns
if (!tableExists($db, 'certificates')) {
    $db->exec("CREATE TABLE `certificates` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `course_id` INT NOT NULL,
        `certificate_number` VARCHAR(100) NOT NULL UNIQUE,
        `issued_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT `fk_certificates_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
        CONSTRAINT `fk_certificates_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
        INDEX `idx_certificates_user` (`user_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    logProgress($outputs, "Created table 'certificates'");
} else {
    logProgress($outputs, "Table 'certificates' already exists");
}

// 13b. Alter certificates table columns
if (tableExists($db, 'certificates')) {
    if (!columnExists($db, 'certificates', 'certificate_code')) {
        $db->exec("ALTER TABLE `certificates` ADD COLUMN `certificate_code` VARCHAR(100) DEFAULT NULL AFTER `course_id`");
        $db->exec("ALTER TABLE `certificates` ADD UNIQUE KEY `uk_certificates_code` (`certificate_code`)");
        logProgress($outputs, "Added column 'certificate_code' to 'certificates'");
    }
}

// 13b. Alter enrollments table columns
// 13b. Alter enrollments table columns
if (tableExists($db, 'enrollments')) {
    if (!columnExists($db, 'enrollments', 'completion_status')) {
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `completion_status` ENUM('Active', 'Completed', 'Dropped') DEFAULT 'Active'");
        logProgress($outputs, "Added column 'completion_status' to 'enrollments'");
    }
    if (!columnExists($db, 'enrollments', 'status')) {
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `status` ENUM('Active', 'Completed', 'Dropped') DEFAULT 'Active' AFTER `course_id`");
        logProgress($outputs, "Added column 'status' to 'enrollments'");
        $db->exec("UPDATE `enrollments` SET `status` = `completion_status` WHERE `completion_status` IS NOT NULL");
    }
    if (!columnExists($db, 'enrollments', 'enrolled_at')) {
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `status`");
        logProgress($outputs, "Added column 'enrolled_at' to 'enrollments'");
        $db->exec("UPDATE `enrollments` SET `enrolled_at` = `enrollment_date` WHERE `enrollment_date` IS NOT NULL");
    }
    if (!columnExists($db, 'enrollments', 'completed_at')) {
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `completed_at` TIMESTAMP NULL DEFAULT NULL AFTER `enrolled_at`");
        logProgress($outputs, "Added column 'completed_at' to 'enrollments'");
        $db->exec("UPDATE `enrollments` SET `completed_at` = `enrollment_date` WHERE `completion_status` = 'Completed'");
    }
    if (!columnExists($db, 'enrollments', 'created_at')) {
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `progress`");
        logProgress($outputs, "Added column 'created_at' to 'enrollments'");
        $db->exec("UPDATE `enrollments` SET `created_at` = `enrollment_date` WHERE `enrollment_date` IS NOT NULL");
    }
    if (!columnExists($db, 'enrollments', 'updated_at')) {
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`");
        logProgress($outputs, "Added column 'updated_at' to 'enrollments'");
    }

    // Set up triggers
    $db->exec("DROP TRIGGER IF EXISTS `before_insert_enrollments`");
    $db->exec("DROP TRIGGER IF EXISTS `before_update_enrollments`");
    $db->exec("
        CREATE TRIGGER `before_insert_enrollments`
        BEFORE INSERT ON `enrollments`
        FOR EACH ROW
        BEGIN
            IF NEW.`status` = 'Active' AND NEW.`completion_status` != 'Active' THEN
                SET NEW.`status` = NEW.`completion_status`;
            ELSEIF NEW.`completion_status` = 'Active' AND NEW.`status` != 'Active' THEN
                SET NEW.`completion_status` = NEW.`status`;
            END IF;
            
            IF NEW.`enrolled_at` = CURRENT_TIMESTAMP AND NEW.`enrollment_date` != CURRENT_TIMESTAMP THEN
                SET NEW.`enrolled_at` = NEW.`enrollment_date`;
            ELSEIF NEW.`enrollment_date` = CURRENT_TIMESTAMP AND NEW.`enrolled_at` != CURRENT_TIMESTAMP THEN
                SET NEW.`enrollment_date` = NEW.`enrolled_at`;
            END IF;

            IF NEW.`status` = 'Completed' AND NEW.`completed_at` IS NULL THEN
                SET NEW.`completed_at` = CURRENT_TIMESTAMP;
            END IF;
        END;
    ");
    $db->exec("
        CREATE TRIGGER `before_update_enrollments`
        BEFORE UPDATE ON `enrollments`
        FOR EACH ROW
        BEGIN
            IF NEW.`completion_status` <> OLD.`completion_status` THEN
                SET NEW.`status` = NEW.`completion_status`;
            ELSEIF NEW.`status` <> OLD.`status` THEN
                SET NEW.`completion_status` = NEW.`status`;
            END IF;

            IF NEW.`status` = 'Completed' AND (OLD.`status` IS NULL OR OLD.`status` <> 'Completed') THEN
                SET NEW.`completed_at` = CURRENT_TIMESTAMP;
            ELSEIF NEW.`status` <> 'Completed' THEN
                SET NEW.`completed_at` = NULL;
            END IF;

            IF NEW.`enrollment_date` <> OLD.`enrollment_date` THEN
                SET NEW.`enrolled_at` = NEW.`enrollment_date`;
            ELSEIF NEW.`enrolled_at` <> OLD.`enrolled_at` THEN
                SET NEW.`enrollment_date` = NEW.`enrolled_at`;
            END IF;
        END;
    ");
    logProgress($outputs, "Verified and updated enrollments table columns and sync triggers");
}

// 14. Establish Foreign Keys safely
try {
    if (tableExists($db, 'course_modules') && tableExists($db, 'courses')) {
        $db->exec("ALTER TABLE `course_modules` ADD CONSTRAINT `fk_modules_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;");
        logProgress($outputs, "Bound foreign key fk_modules_course");
    }
    if (tableExists($db, 'lectures') && tableExists($db, 'course_modules')) {
        $db->exec("ALTER TABLE `lectures` ADD CONSTRAINT `fk_lectures_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE CASCADE;");
        logProgress($outputs, "Bound foreign key fk_lectures_module");
    }
    if (tableExists($db, 'announcements') && tableExists($db, 'courses')) {
        $db->exec("ALTER TABLE `announcements` ADD CONSTRAINT `fk_announcements_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;");
        $db->exec("ALTER TABLE `announcements` ADD CONSTRAINT `fk_announcements_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;");
        logProgress($outputs, "Bound foreign keys for announcements");
    }
    if (tableExists($db, 'course_resources') && tableExists($db, 'courses')) {
        $db->exec("ALTER TABLE `course_resources` ADD CONSTRAINT `fk_resources_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;");
        $db->exec("ALTER TABLE `course_resources` ADD CONSTRAINT `fk_resources_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE SET NULL;");
        logProgress($outputs, "Bound foreign keys for course_resources");
    }
    if (tableExists($db, 'lecture_progress') && tableExists($db, 'users') && tableExists($db, 'lectures')) {
        $db->exec("ALTER TABLE `lecture_progress` ADD CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;");
        $db->exec("ALTER TABLE `lecture_progress` ADD CONSTRAINT `fk_progress_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`) ON DELETE CASCADE;");
        logProgress($outputs, "Bound foreign keys for lecture_progress");
    }
    if (tableExists($db, 'courses') && tableExists($db, 'categories')) {
        $db->exec("ALTER TABLE `courses` ADD CONSTRAINT `fk_courses_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;");
        logProgress($outputs, "Bound foreign key fk_courses_category");
    }
    if (tableExists($db, 'assignments') && tableExists($db, 'course_modules')) {
        // Drop old foreign key if it exists
        try {
            $db->exec("ALTER TABLE `assignments` DROP FOREIGN KEY `fk_assignments_module`;");
        } catch (Exception $e) {}
        $db->exec("ALTER TABLE `assignments` ADD CONSTRAINT `fk_assignments_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE SET NULL;");
        logProgress($outputs, "Bound foreign key fk_assignments_module");
    }
} catch (Exception $e) {
    logProgress($outputs, "Foreign Key error (some might already exist): " . $e->getMessage(), false);
}

// 15. Create orders table (Razorpay payment records)
if (!tableExists($db, 'orders')) {
    $sql = "CREATE TABLE `orders` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `course_id` INT NOT NULL,
        `razorpay_order_id` VARCHAR(100) NOT NULL UNIQUE,
        `razorpay_payment_id` VARCHAR(100) DEFAULT NULL,
        `razorpay_signature` VARCHAR(512) DEFAULT NULL,
        `amount` DECIMAL(10,2) NOT NULL,
        `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
        `status` ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
        `failure_reason` TEXT DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_orders_user` (`user_id`),
        INDEX `idx_orders_course` (`course_id`),
        INDEX `idx_orders_status` (`status`),
        INDEX `idx_orders_razorpay_order` (`razorpay_order_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $db->exec($sql);
    logProgress($outputs, "Created table 'orders'");
} else {
    logProgress($outputs, "Table 'orders' already exists");
}

// 16. Add payment columns to enrollments table
if (tableExists($db, 'enrollments')) {
    if (!columnExists($db, 'enrollments', 'order_id')) {
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `order_id` INT DEFAULT NULL AFTER `certificate_issued`");
        logProgress($outputs, "Added column 'order_id' to 'enrollments'");
    }
    if (!columnExists($db, 'enrollments', 'payment_status')) {
        $db->exec("ALTER TABLE `enrollments` ADD COLUMN `payment_status` ENUM('free','paid','pending','failed') NOT NULL DEFAULT 'free' AFTER `order_id`");
        logProgress($outputs, "Added column 'payment_status' to 'enrollments'");
    }
}

// 17. Bind FK: orders -> users, orders -> courses
try {
    if (tableExists($db, 'orders') && tableExists($db, 'users')) {
        $db->exec("ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;");
        logProgress($outputs, "Bound foreign key fk_orders_user");
    }
    if (tableExists($db, 'orders') && tableExists($db, 'courses')) {
        $db->exec("ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;");
        logProgress($outputs, "Bound foreign key fk_orders_course");
    }
    if (tableExists($db, 'enrollments') && tableExists($db, 'orders')) {
        $db->exec("ALTER TABLE `enrollments` ADD CONSTRAINT `fk_enrollments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;");
        logProgress($outputs, "Bound foreign key fk_enrollments_order");
    }
} catch (Exception $e) {
    logProgress($outputs, "Orders FK binding (some may already exist): " . $e->getMessage(), false);
}

// Re-enable foreign key checks
$db->exec("SET FOREIGN_KEY_CHECKS = 1;");

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Migration Progress</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 40px; margin: 0; }
        .container { max-width: 800px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
        h1 { color: #f8fafc; font-size: 24px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .log-item { display: flex; align-items: center; gap: 10px; padding: 12px; margin-bottom: 8px; border-radius: 6px; background-color: #334155; }
        .log-item.error { background-color: #7f1d1d; color: #fca5a5; }
        .icon-success { color: #10b981; font-weight: bold; }
        .icon-error { color: #ef4444; font-weight: bold; }
        .btn { display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .btn:hover { background-color: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚙️ Database Migration Log</h1>
        <div class="logs">
            <?php foreach ($outputs as $item): ?>
                <div class="log-item <?php echo $item['success'] ? '' : 'error'; ?>">
                    <span><?php echo $item['success'] ? '<span class="icon-success">✓</span>' : '<span class="icon-error">✗</span>'; ?></span>
                    <span><?php echo htmlspecialchars($item['message']); ?></span>
                </div>
            <?php endforeach; ?>
        </div>
        <p style="margin-top: 25px; color: #94a3b8; font-size: 14px;">Migration complete! You can now verify the database status.</p>
        <a href="verify_database.php?key=debug123" class="btn">Go to Diagnostics</a>
    </div>
</body>
</html>
