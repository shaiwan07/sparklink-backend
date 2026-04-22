-- Migration v7: All gap-analysis DB changes

-- 0. video_calls: Agora channel name + expiry fields (replaces deleted migration_v4/v5)
ALTER TABLE video_calls
  ADD COLUMN channel_name VARCHAR(100) DEFAULT NULL,
  ADD COLUMN rtc_token TEXT DEFAULT NULL,
  ADD COLUMN expires_at DATETIME DEFAULT NULL,
  ADD COLUMN notified_before TINYINT(1) NOT NULL DEFAULT 0;

-- 1. terms_accepted: mandatory checkbox on signup screen 09
ALTER TABLE users
  ADD COLUMN terms_accepted TINYINT(1) NOT NULL DEFAULT 0;

-- 2. suspended_until: 24-hour auto-suspension when reported during a call
ALTER TABLE users
  ADD COLUMN suspended_until DATETIME DEFAULT NULL;

-- 3. reports: link to call being reported + admin review status
ALTER TABLE reports
  ADD COLUMN video_call_id BIGINT DEFAULT NULL,
  ADD COLUMN status ENUM('pending','reviewed','dismissed') NOT NULL DEFAULT 'pending';

-- 4. matches: spark_mode flag — both users locked to each other while matched
ALTER TABLE matches
  ADD COLUMN spark_mode TINYINT(1) NOT NULL DEFAULT 0;

-- 5. matches: track when the last 4-hour scheduling reminder was sent
ALTER TABLE matches
  ADD COLUMN last_reminder_sent DATETIME DEFAULT NULL;

-- 6. users: Apple Sign In provider ID
ALTER TABLE users
  ADD COLUMN apple_id VARCHAR(100) DEFAULT NULL,
  ADD UNIQUE KEY uq_apple_id (apple_id);
