-- Migration 06: Update lectures table
-- Adds missing: status column and composite indexes for efficient module+sort and module+status queries
-- Suitable for phpMyAdmin and Hostinger Shared MySQL servers
-- Safe: Uses ALTER TABLE with IF NOT EXISTS guards where supported, and dynamic check runner

-- Step 1: Add `status` column (if not already present)
-- Mirrors the status pattern used across course_modules, courses, etc.
ALTER TABLE `lectures`
    ADD COLUMN IF NOT EXISTS `status` ENUM('Draft', 'Published', 'Archived') NOT NULL DEFAULT 'Draft'
    AFTER `sort_order`;

-- Step 2: Add composite index for efficient module+order queries
-- Supports listing and ordering of lectures within a module
ALTER TABLE `lectures`
    ADD INDEX IF NOT EXISTS `idx_lectures_module_sort` (`module_id`, `sort_order`);

-- Step 3: Add composite index for module+status filter queries
-- Supports "published lectures only" queries used in student-facing views
ALTER TABLE `lectures`
    ADD INDEX IF NOT EXISTS `idx_lectures_module_status` (`module_id`, `status`);

-- Verification: Final expected schema for lectures
-- id            INT AUTO_INCREMENT PK
-- module_id     INT NOT NULL       FK -> course_modules(id) ON DELETE CASCADE
-- title         VARCHAR(255)       NOT NULL
-- description   TEXT               DEFAULT NULL
-- video_url     VARCHAR(255)       DEFAULT NULL
-- duration      VARCHAR(50)        DEFAULT NULL
-- sort_order    INT                NOT NULL DEFAULT 0
-- status        ENUM               NOT NULL DEFAULT 'Draft'   [ADDED]
-- is_preview    TINYINT(1)         DEFAULT 0
-- video_type    VARCHAR(50)        DEFAULT 'html5'
-- video_id      VARCHAR(255)       DEFAULT NULL
-- created_at    TIMESTAMP          DEFAULT CURRENT_TIMESTAMP
-- updated_at    TIMESTAMP          ON UPDATE CURRENT_TIMESTAMP
-- Indexes: idx_lectures_module, idx_lectures_sort,
--          idx_lectures_module_sort [ADDED], idx_lectures_module_status [ADDED]
