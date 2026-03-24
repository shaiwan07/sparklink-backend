const pool = require('../config/db');

const VideoCall = {
  async schedule(match_id, scheduled_time) {
    await pool.query(
      'INSERT INTO videocalls (match_id, scheduled_time, status) VALUES (?, ?, ?)',
      [match_id, scheduled_time, 'pending']
    );
  },
  async getUserCalls(user_id) {
    const [rows] = await pool.query(
      'SELECT vc.*, m.user1_id, m.user2_id FROM videocalls vc JOIN Matches m ON vc.match_id = m.id WHERE m.user1_id=? OR m.user2_id=?',
      [user_id, user_id]
    );
    return rows;
  },
  async updateStatus(call_id, status) {
    await pool.query(
      'UPDATE videocalls SET status=? WHERE id=?',
      [status, call_id]
    );
  }
};

module.exports = VideoCall;
