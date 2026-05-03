-- Migration V8: Availability date-based system + Gap Report category renames
-- Run this against the sparklink database

-- 1. Availability: Switch from day_of_week to date-based slots
ALTER TABLE `availability`
  DROP COLUMN `day_of_week`,
  DROP COLUMN `start_time`,
  DROP COLUMN `end_time`,
  ADD COLUMN `slot_date` DATE NOT NULL,
  ADD COLUMN `slot_time` TIME NOT NULL,
  ADD UNIQUE KEY `unique_user_slot` (`user_id`, `slot_date`, `slot_time`);

-- 2. Gap Report: Rename categories to match figma design
UPDATE `question_categories` SET `name` = 'Relationship Goals' WHERE `category_id` = 1;
UPDATE `question_categories` SET `name` = 'Family & Children' WHERE `category_id` = 2;
UPDATE `question_categories` SET `name` = 'Shared Values' WHERE `category_id` = 3;
