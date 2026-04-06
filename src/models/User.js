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
  },

  // Get current step for a user
  async getCurrentStep(userId) {
    const [rows] = await pool.query('SELECT current_step FROM users WHERE id=?', [userId]);
    return rows[0]?.current_step || 1;
  },

  // Set current step for a user
  async setCurrentStep(userId, step) {
    await pool.query('UPDATE users SET current_step=? WHERE id=?', [step, userId]);
  },

  // Get IDs of users to exclude from matching (blocked, unmatched, already matched, self)
  async getExcludedUserIds(userId) {
    // Exclude self, blocked, unmatched, already matched
    // You can expand this logic as needed
    const [rows] = await pool.query(`
      SELECT DISTINCT u.id FROM users u
      LEFT JOIN matches m1 ON (m1.user1_id = ? AND m1.user2_id = u.id)
      LEFT JOIN matches m2 ON (m2.user2_id = ? AND m2.user1_id = u.id)
      WHERE u.id = ? OR m1.id IS NOT NULL OR m2.id IS NOT NULL
    `, [userId, userId, userId]);
    return rows.map(r => r.id);
  },

  // Find users matching preferences (excluding excludedIds)
  async findPotentialMatches({ userId, gender, minAge, maxAge, excludedIds }) {
    let query = `SELECT * FROM users WHERE id != ?`;
    const params = [userId];
    if (gender && gender !== 'all') {
      query += ' AND gender = ?';
      params.push(gender);
    }
    if (minAge) {
      query += ' AND age >= ?';
      params.push(minAge);
    }
    if (maxAge) {
      query += ' AND age <= ?';
      params.push(maxAge);
    }
    if (excludedIds && excludedIds.length > 0) {
      query += ` AND id NOT IN (${excludedIds.map(() => '?').join(',')})`;
      params.push(...excludedIds);
    }
    const [rows] = await pool.query(query, params);
    return rows;
  }
};

module.exports = User;
