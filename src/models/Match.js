const pool = require('../config/db');

const Match = {
  async likeUser(user1_id, user2_id) {
    // Like: create or update match status
    await pool.query(
      'INSERT INTO matches (user1_id, user2_id, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status=?',
      [user1_id, user2_id, 'pending', 'pending']
    );
    // Check if reciprocal like exists
    const [rows] = await pool.query(
      'SELECT * FROM matches WHERE user1_id=? AND user2_id=? AND status="pending"',
      [user2_id, user1_id]
    );
    if (rows.length > 0) {
      // Update both to matched
      await pool.query(
        'UPDATE matches SET status="matched" WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)',
        [user1_id, user2_id, user2_id, user1_id]
      );
      return 'matched';
    }
    return 'pending';
  },
  async dislikeUser(user1_id, user2_id) {
    await pool.query(
      'INSERT INTO matches (user1_id, user2_id, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status=?',
      [user1_id, user2_id, 'unmatched', 'unmatched']
    );
  },
  async getMatches(user_id) {
    const [rows] = await pool.query(
      'SELECT * FROM matches WHERE (user1_id=? OR user2_id=?) AND status="matched"',
      [user_id, user_id]
    );
    return rows;
  },
  async unmatch(user1_id, user2_id) {
    await pool.query(
      'UPDATE matches SET status="unmatched" WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)',
      [user1_id, user2_id, user2_id, user1_id]
    );
  },
  async block(user1_id, user2_id) {
    await pool.query(
      'UPDATE matches SET status="blocked" WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)',
      [user1_id, user2_id, user2_id, user1_id]
    );
  }
};

module.exports = Match;
