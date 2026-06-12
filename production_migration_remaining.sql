-- BG Realty LMS Production Database Migration Script (Final Remaining Steps - Updated)
-- Run this in phpMyAdmin to complete the assignments module columns, foreign keys, and submission status enum.
-- -------------------------------------------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Add missing module_id column to assignments table
-- Note: If MySQL says "Duplicate column name 'module_id'", it is safe to proceed.
ALTER TABLE `assignments` ADD COLUMN `module_id` INT DEFAULT NULL AFTER `course_id`;

-- 2. Bind module foreign key constraint on assignments table
ALTER TABLE `assignments` ADD CONSTRAINT `fk_assignments_module` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE SET NULL;

-- 3. Adjust assignment submission status enum to support "Under Review" and "Revision Requested"
ALTER TABLE `assignment_submissions` 
    MODIFY COLUMN `status` ENUM('Submitted', 'Under Review', 'Graded', 'Revision Requested') NOT NULL DEFAULT 'Submitted';

SET FOREIGN_KEY_CHECKS = 1;
