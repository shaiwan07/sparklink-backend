const pool = require('../config/db');

const EXPIRE_MINUTES = 20;

const VideoCall = {
  // Create a call record; expires_at = scheduled_time + 20 min (or NOW + 20 min for instant calls)
  async schedule(match_id, scheduled_time, channel_name = null, rtc_token = null) {
    const base = scheduled_time ? new Date(scheduled_time) : new Date();
    const expires_at = new Date(base.getTime() + EXPIRE_MINUTES * 60 * 1000);

    const [result] = await pool.query(
      `INSERT INTO video_calls
         (match_id, scheduled_time, status, channel_name, rtc_token, expires_at)
       VALUES (?, ?, 'scheduled', ?, ?, ?)`,
      [match_id, scheduled_time || null, channel_name, rtc_token, expires_at]
    );
    return result.insertId;
  },

  async getUserCalls(user_id) {
    const [rows] = await pool.query(
      `SELECT vc.call_id, vc.match_id, vc.scheduled_time, vc.status,
              vc.channel_name, vc.meeting_link, vc.expires_at, vc.created_at,
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
              channel_name, meeting_link, expires_at, created_at
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
              channel_name, meeting_link, expires_at, created_at
       FROM video_calls WHERE call_id = ?`,
      [call_id]
    );
    return rows[0] || null;
  },

  // Returns any call this user is currently in (status = 'active')
  async getActiveCall(user_id) {
    const [rows] = await pool.query(
      `SELECT vc.call_id, vc.match_id, vc.channel_name, vc.status
       FROM video_calls vc
       JOIN matches m ON vc.match_id = m.match_id
       WHERE (m.user1_id = ? OR m.user2_id = ?)
         AND vc.status = 'active'
       LIMIT 1`,
      [user_id, user_id]
    );
    return rows[0] || null;
  },

  // Calls whose scheduled_time is between (now + minMin) and (now + maxMin) and not yet notified
  async getUpcomingUnnotified(minMin, maxMin) {
    const [rows] = await pool.query(
      `SELECT vc.call_id, vc.match_id, vc.scheduled_time,
              m.user1_id, m.user2_id
       FROM video_calls vc
       JOIN matches m ON vc.match_id = m.match_id
       WHERE vc.status = 'scheduled'
         AND vc.notified_before = 0
         AND vc.scheduled_time BETWEEN
               DATE_ADD(NOW(), INTERVAL ? MINUTE) AND
               DATE_ADD(NOW(), INTERVAL ? MINUTE)`,
      [minMin, maxMin]
    );
    return rows;
  },

  async markNotified(call_id) {
    await pool.query(
      'UPDATE video_calls SET notified_before = 1 WHERE call_id = ?',
      [call_id]
    );
  },

  // Expire all scheduled calls whose window has passed
  async expireStale() {
    await pool.query(
      `UPDATE video_calls
       SET status = 'expired'
       WHERE status = 'scheduled' AND expires_at < NOW()`
    );
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
