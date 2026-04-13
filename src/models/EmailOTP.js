const pool = require('../config/db');

const EmailOTP = {
  // Create OTP keyed by email (matches DB schema: email_otp.email column)
  async createOTP(email, otp, type = 'signup') {
    // Mark any previous OTPs for this email as used
    await pool.query('UPDATE email_otp SET is_used = 1 WHERE email = ? AND is_used = 0', [email]);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await pool.query(
      'INSERT INTO email_otp (email, otp, type, is_used, expires_at) VALUES (?, ?, ?, 0, ?)',
      [email, otp, type, expiresAt]
    );
  },

  // Get the latest valid (unused, unexpired) OTP for an email
  async getOTP(email) {
    const [rows] = await pool.query(
      'SELECT otp FROM email_otp WHERE email = ? AND is_used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [email]
    );
    return rows[0] ? rows[0].otp : null;
  },

  // Mark OTP as used (after successful verification)
  async markUsed(email) {
    await pool.query('UPDATE email_otp SET is_used = 1 WHERE email = ? AND is_used = 0', [email]);
  },

  // Delete all OTPs for an email
  async deleteOTP(email) {
    await pool.query('DELETE FROM email_otp WHERE email = ?', [email]);
  }
};

module.exports = EmailOTP;
