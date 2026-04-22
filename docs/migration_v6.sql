-- Migration v6: availability_requests — track how many times User A has
-- requested User B to set availability for a given match. Max 3 per pair.

CREATE TABLE IF NOT EXISTS availability_requests (
  id            BIGINT        NOT NULL AUTO_INCREMENT,
  match_id      INT           NOT NULL,
  from_user_id  BIGINT        NOT NULL,
  to_user_id    BIGINT        NOT NULL,
  request_count TINYINT       NOT NULL DEFAULT 1,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_request_per_match (match_id, from_user_id)
);
