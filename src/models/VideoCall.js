const pool = require('../config/db');

const VideoCall = {
  // Create a call record with Agora channel info
  async schedule(match_id, scheduled_time, channel_name = null, rtc_token = null) {
    const [result] = await pool.query(
      `INSERT INTO video_calls
         (match_id, scheduled_time, status, channel_name, rtc_token)
       VALUES (?, ?, 'scheduled', ?, ?)`,
      [match_id, scheduled_time || null, channel_name, rtc_token]
    );
    return result.insertId;
  },

  async getUserCalls(user_id) {
    const [rows] = await pool.query(
      `SELECT vc.call_id, vc.match_id, vc.scheduled_time, vc.status,
              vc.channel_name, vc.meeting_link, vc.created_at,
              m.user1_id, m.user2_id
       FROM video_calls vc
       JOIN matches m ON vc.match_id = m.match_id
       WHERE m.user1_id = ? OR m.user2_id = ?
       ORDER BY vc.scheduled_time DESC`,
      [user_id, user_id]
    );
    return rows;
  },

  async getByMatchId(match_id) {
    const [rows] = await pool.query(
      `SELECT call_id, match_id, scheduled_time, status,
              channel_name, meeting_link, created_at
       FROM video_calls
       WHERE match_id = ?
       ORDER BY scheduled_time DESC LIMIT 1`,
      [match_id]
    );
    return rows[0] || null;
  },

  async getByCallId(call_id) {
    const [rows] = await pool.query(
      `SELECT call_id, match_id, scheduled_time, status,
              channel_name, meeting_link, created_at
       FROM video_calls WHERE call_id = ?`,
      [call_id]
    );
    return rows[0] || null;
  },

  async updateStatus(call_id, status) {
    await pool.query(
      'UPDATE video_calls SET status = ? WHERE call_id = ?',
      [status, call_id]
    );
  },

  async cancel(call_id) {
    await pool.query(
      "UPDATE video_calls SET status = 'cancelled' WHERE call_id = ?",
      [call_id]
    );
  }
};

module.exports = VideoCall;
