-- Migration v5: video_calls — add expires_at, notified_before; extend status ENUM

ALTER TABLE video_calls
  ADD COLUMN IF NOT EXISTS expires_at      DATETIME     DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS notified_before TINYINT(1)   NOT NULL DEFAULT 0;

-- Extend status to include 'active' and 'expired'
ALTER TABLE video_calls
  MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'scheduled';
