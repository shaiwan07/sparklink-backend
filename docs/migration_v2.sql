-- ============================================================
-- Sparklink DB Migration v2
-- Run this against your `sparklink` database
-- ============================================================

-- 1. Add `current_step` to users (tracks onboarding progress 1–6)
ALTER TABLE `users`
  ADD COLUMN `current_step` tinyint DEFAULT 1 AFTER `is_verified`;

-- 2. Add `height` to users (shown on Preferences screen, step 3/6)
ALTER TABLE `users`
  ADD COLUMN `height` int DEFAULT NULL AFTER `age`;

-- 3. Add `instagram_username` to users (shown on "It's a Match!" screen 55)
ALTER TABLE `users`
  ADD COLUMN `instagram_username` varchar(100) DEFAULT NULL AFTER `phone`;

-- 4. Create `reports` table (for "Report Harasser" feature on screen 56)
CREATE TABLE IF NOT EXISTS `reports` (
  `report_id` bigint NOT NULL AUTO_INCREMENT,
  `reporter_id` bigint NOT NULL,
  `reported_id` bigint NOT NULL,
  `reason` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `reporter_id` (`reporter_id`),
  KEY `reported_id` (`reported_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reported_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Add `fcm_token` to users (stores device FCM push token)
ALTER TABLE `users`
  ADD COLUMN `fcm_token` varchar(512) DEFAULT NULL;

-- ============================================================
-- No changes required to existing tables — all other fixes
-- were in the application layer (models/controllers).
-- ============================================================
