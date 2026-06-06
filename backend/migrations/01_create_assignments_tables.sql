-- Migration: Create Assignments and Assignment Submissions tables
-- Suitable for phpMyAdmin and Hostinger Shared MySQL servers

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Create assignments table
CREATE TABLE IF NOT EXISTS `assignments` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create assignment_submissions table
CREATE TABLE IF NOT EXISTS `assignment_submissions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `assignment_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `marks` INT DEFAULT NULL,
    `feedback` TEXT DEFAULT NULL,
    `status` ENUM('Submitted', 'Graded', 'Rejected') NOT NULL DEFAULT 'Submitted',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
