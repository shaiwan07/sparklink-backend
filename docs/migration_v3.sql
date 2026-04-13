-- ============================================================
-- Sparklink DB Migration v3
-- Run this against your `sparklink` database
-- ============================================================

-- Add instagram_username to users table (shown on "It's a Match!" screen 55)
ALTER TABLE `users`
  ADD COLUMN `instagram_username` varchar(100) DEFAULT NULL;

-- ============================================================
