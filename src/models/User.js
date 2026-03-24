const pool = require('../config/db');

const User = {
  async updatePassword(userId, password_hash) {
    await pool.query('UPDATE users SET password_hash=? WHERE id=?', [password_hash, userId]);
  },
  async verify(userId) {
    await pool.query('UPDATE users SET is_verified=1 WHERE id=?', [userId]);
  },
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  async create({ email, password_hash }) {
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, password_hash]
    );
    return result.insertId;
  },
  async existsByEmail(email) {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    return rows.length > 0;
  },

  // Dynamic update for any fields (sets: 'field1=?, field2=?', values: [..., userId])
  async updateFields(sets, values) {
    await pool.query(`UPDATE users SET ${sets} WHERE id=?`, values);
  }
};

module.exports = User;
