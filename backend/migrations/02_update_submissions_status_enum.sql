-- Migration: Update status ENUM values for Assignment Submissions table
-- Supports: Submitted, Under Review, Graded, Revision Requested

ALTER TABLE `assignment_submissions` 
MODIFY COLUMN `status` ENUM('Submitted', 'Under Review', 'Graded', 'Revision Requested') NOT NULL DEFAULT 'Submitted';
