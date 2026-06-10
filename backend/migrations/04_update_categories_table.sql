-- Migration: Add image and sort_order to categories table
ALTER TABLE `categories` ADD COLUMN `image` VARCHAR(255) DEFAULT NULL AFTER `description`;
ALTER TABLE `categories` ADD COLUMN `sort_order` INT NOT NULL DEFAULT 0 AFTER `status`;
