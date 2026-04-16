-- ============================================================
-- Sparklink DB Migration v4  — Social Auth + Agora Video
-- Run against the `sparklink` database
-- ============================================================

-- 1. Social login provider columns on users
ALTER TABLE `users`
  ADD COLUMN `facebook_id` varchar(100) DEFAULT NULL,
  ADD COLUMN `google_id`   varchar(100) DEFAULT NULL;

-- Unique indexes so lookups are fast and duplicates are prevented
ALTER TABLE `users`
  ADD UNIQUE KEY `uq_facebook_id` (`facebook_id`),
  ADD UNIQUE KEY `uq_google_id`   (`google_id`);

-- 2. instagram_username (from migration_v3 — add only if not already applied)
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `instagram_username` varchar(100) DEFAULT NULL;

-- 3. Agora channel name on video_calls
ALTER TABLE `video_calls`
  ADD COLUMN `channel_name` varchar(120) DEFAULT NULL,
  ADD COLUMN `rtc_token`    text          DEFAULT NULL;

-- ============================================================
