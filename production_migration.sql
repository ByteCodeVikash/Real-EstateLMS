-- BG Realty LMS Production Database Migration Script
-- Target Database: Hostinger Shared MySQL / phpMyAdmin
-- ------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS `categories` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create course_modules table
CREATE TABLE IF NOT EXISTS `course_modules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `course_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft',
    `lectures` LONGTEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_modules_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    INDEX `idx_modules_course` (`course_id`),
    INDEX `idx_modules_sort` (`sort_order`),
    INDEX `idx_modules_course_sort` (`course_id`, `sort_order`),
    INDEX `idx_modules_course_status` (`course_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create lectures table
CREATE TABLE IF NOT EXISTS `lectures` (
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
    CONSTRAINT `fk_lectures_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE CASCADE,
    INDEX `idx_lectures_module` (`module_id`),
    INDEX `idx_lectures_sort` (`sort_order`),
    INDEX `idx_lectures_module_sort` (`module_id`, `sort_order`),
    INDEX `idx_lectures_module_status` (`module_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create announcements table
CREATE TABLE IF NOT EXISTS `announcements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `created_by` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_announcements_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create course_resources table
CREATE TABLE IF NOT EXISTS `course_resources` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `course_id` INT NOT NULL,
    `module_id` INT DEFAULT NULL,
    `title` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(50) DEFAULT NULL,
    `file_size` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_resources_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_resources_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create lecture_progress table
CREATE TABLE IF NOT EXISTS `lecture_progress` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `lecture_id` INT NOT NULL,
    `playhead_seconds` INT DEFAULT 0,
    `duration_seconds` INT DEFAULT 0,
    `is_completed` TINYINT(1) DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_lecture` (`user_id`, `lecture_id`),
    CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_progress_lecture` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Add recording_url column to webinars
ALTER TABLE `webinars` ADD COLUMN `recording_url` VARCHAR(255) DEFAULT NULL;

-- 8. Add Google OAuth integration columns to users
ALTER TABLE `users` 
    ADD COLUMN `google_id` VARCHAR(255) DEFAULT NULL AFTER `password_hash`,
    ADD COLUMN `avatar_url` VARCHAR(255) DEFAULT NULL AFTER `profile_image`,
    ADD COLUMN `auth_provider` VARCHAR(50) DEFAULT 'local' AFTER `updated_at`,
    ADD UNIQUE KEY `uk_users_google_id` (`google_id`);

-- 9. Add category FK constraint to courses
ALTER TABLE `courses`
    ADD CONSTRAINT `fk_courses_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
    ADD INDEX `idx_courses_category_id` (`category_id`);

-- 10. Re-bind module FK constraint on assignments
-- Ensures the constraint points correctly to the new course_modules table
ALTER TABLE `assignments` DROP FOREIGN KEY `fk_assignments_module`;
ALTER TABLE `assignments` ADD CONSTRAINT `fk_assignments_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE SET NULL;

-- 11. Adjust assignment submission status enum
ALTER TABLE `assignment_submissions` 
    MODIFY COLUMN `status` ENUM('Submitted', 'Under Review', 'Graded', 'Revision Requested') NOT NULL DEFAULT 'Submitted';

SET FOREIGN_KEY_CHECKS = 1;
