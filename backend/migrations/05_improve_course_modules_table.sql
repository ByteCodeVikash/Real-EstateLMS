-- Migration 05: Improve course_modules table
-- Adds missing: status column, updated_at timestamp, and composite index
-- Suitable for phpMyAdmin and Hostinger Shared MySQL servers
-- Safe: Uses ALTER TABLE with IF NOT EXISTS guard logic via column existence check

-- Step 1: Add `status` column (if not already present)
-- Mirrors the status pattern used across courses, assignments, etc.
ALTER TABLE `course_modules`
    ADD COLUMN IF NOT EXISTS `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft'
    AFTER `sort_order`;

-- Step 2: Add `updated_at` column (if not already present)
ALTER TABLE `course_modules`
    ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    AFTER `created_at`;

-- Step 3: Add composite index for efficient course+order queries
-- Supports paginated listing of modules ordered within a course
ALTER TABLE `course_modules`
    ADD INDEX IF NOT EXISTS `idx_modules_course_sort` (`course_id`, `sort_order`);

-- Step 4: Add composite index for course+status filter queries
-- Supports "published modules only" queries used in student-facing views
ALTER TABLE `course_modules`
    ADD INDEX IF NOT EXISTS `idx_modules_course_status` (`course_id`, `status`);

-- Verification: Final expected schema for course_modules
-- id            INT AUTO_INCREMENT PK
-- course_id     INT NOT NULL       FK -> courses(id) ON DELETE CASCADE
-- title         VARCHAR(255)       NOT NULL
-- description   TEXT               DEFAULT NULL
-- sort_order    INT                NOT NULL DEFAULT 0
-- status        ENUM               NOT NULL DEFAULT 'Draft'   [ADDED]
-- lectures      LONGTEXT           DEFAULT NULL  (legacy JSON, kept for compatibility)
-- created_at    TIMESTAMP          DEFAULT CURRENT_TIMESTAMP
-- updated_at    TIMESTAMP          ON UPDATE CURRENT_TIMESTAMP  [ADDED]
-- Indexes: idx_modules_course, idx_modules_sort,
--          idx_modules_course_sort [ADDED], idx_modules_course_status [ADDED]
