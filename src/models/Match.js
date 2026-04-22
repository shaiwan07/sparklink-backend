const pool = require('../config/db');

const Match = {
  // Record a swipe and auto-create a match if mutual like/superlike
  async swipe(from_user, to_user, action) {
    // Insert or update swipe (UNIQUE KEY on from_user, to_user)
    await pool.query(
      `INSERT INTO swipes (from_user, to_user, action)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE action = VALUES(action)`,
      [from_user, to_user, action]
    );

    // Only check for mutual match on like or superlike
    if (action === 'dislike') return { result: 'disliked' };

    // Check if the other user already liked/superliked back
    const [rows] = await pool.query(
      `SELECT swipe_id FROM swipes
       WHERE from_user = ? AND to_user = ? AND action IN ('like', 'superlike')`,
      [to_user, from_user]
    );

    if (rows.length > 0) {
      // Mutual like — create match with spark_mode = 1 (ignore if already exists)
      await pool.query(
        `INSERT IGNORE INTO matches (user1_id, user2_id, status, spark_mode)
         VALUES (?, ?, 'matched', 1)`,
        [Math.min(from_user, to_user), Math.max(from_user, to_user)]
      );
      return { result: 'matched' };
    }

    return { result: 'liked' };
  },

  async likeUser(from_user, to_user) {
    return Match.swipe(from_user, to_user, 'like');
  },

  async superlikeUser(from_user, to_user) {
    return Match.swipe(from_user, to_user, 'superlike');
  },

  async dislikeUser(from_user, to_user) {
    return Match.swipe(from_user, to_user, 'dislike');
  },

  async getMatches(user_id) {
    const [rows] = await pool.query(
      `SELECT m.match_id, m.user1_id, m.user2_id, m.status, m.created_at,
              CASE WHEN m.user1_id = ? THEN m.user2_id ELSE m.user1_id END AS matched_user_id
       FROM matches m
       WHERE (m.user1_id = ? OR m.user2_id = ?) AND m.status = 'matched'
       ORDER BY m.created_at DESC`,
      [user_id, user_id, user_id]
    );
    return rows;
  },

  async getMatchById(match_id) {
    const [rows] = await pool.query(
      'SELECT * FROM matches WHERE match_id = ?',
      [match_id]
    );
    return rows[0] || null;
  },

  // Returns true if this user is currently in an active spark_mode match
  // (used to block them from liking others and prevent others from liking them)
  async isInSparkMode(user_id) {
    const [rows] = await pool.query(
      `SELECT match_id FROM matches
       WHERE (user1_id = ? OR user2_id = ?)
         AND status = 'matched' AND spark_mode = 1
       LIMIT 1`,
      [user_id, user_id]
    );
    return rows.length > 0;
  },

  async getMatchBetween(user1_id, user2_id) {
    const u1 = Math.min(user1_id, user2_id);
    const u2 = Math.max(user1_id, user2_id);
    const [rows] = await pool.query(
      `SELECT * FROM matches WHERE user1_id = ? AND user2_id = ? AND status = 'matched'`,
      [u1, u2]
    );
    return rows[0] || null;
  },

  async unmatch(user1_id, user2_id) {
    await pool.query(
      `UPDATE matches SET status = 'unmatched'
       WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
      [user1_id, user2_id, user2_id, user1_id]
    );
  },

  async block(user1_id, user2_id) {
    await pool.query(
      `UPDATE matches SET status = 'blocked'
       WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
      [user1_id, user2_id, user2_id, user1_id]
    );
  }
};

module.exports = Match;
