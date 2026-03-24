const pool = require('../config/db');

const EmailOTP = {
  async createOTP(userId, otp) {
    await pool.query('INSERT INTO emailotp (user_id, otp, created_at) VALUES (?, ?, NOW())', [userId, otp]);
  },
  async getOTP(userId) {
    const [rows] = await pool.query('SELECT otp FROM emailotp WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId]);
    return rows[0] ? rows[0].otp : null;
  },
  async deleteOTP(userId) {
    await pool.query('DELETE FROM emailotp WHERE user_id = ?', [userId]);
  }
};

module.exports = EmailOTP;
