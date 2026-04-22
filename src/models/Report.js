const pool = require('../config/db');

const Report = {
  async create({ reporter_id, reported_id, reason, video_call_id = null }) {
    const [result] = await pool.query(
      'INSERT INTO reports (reporter_id, reported_id, reason, video_call_id, status) VALUES (?, ?, ?, ?, ?)',
      [reporter_id, reported_id, reason, video_call_id || null, 'pending']
    );
    return result.insertId;
  },

  async updateStatus(report_id, status) {
    await pool.query(
      "UPDATE reports SET status = ? WHERE report_id = ?",
      [status, report_id]
    );
  }
};

module.exports = { Report };
