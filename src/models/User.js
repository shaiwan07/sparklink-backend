const pool = require('../config/db');

const User = {
  async findById(userId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByPhone(phone) {
    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    return rows[0] || null;
  },

  async findByFacebookId(facebook_id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE facebook_id = ?', [facebook_id]);
    return rows[0] || null;
  },

  async findByGoogleId(google_id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [google_id]);
    return rows[0] || null;
  },

  async create({ email, password_hash }) {
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, password_hash]
    );
    return result.insertId;
  },

  // Create a user who signed up via a social provider (no password required)
  async createSocialUser({ email, full_name, profile_photo_url, facebook_id, google_id }) {
    const [result] = await pool.query(
      `INSERT INTO users
         (email, full_name, profile_photo_url, facebook_id, google_id, is_verified, password_hash)
       VALUES (?, ?, ?, ?, ?, 1, '')`,
      [
        email          || null,
        full_name      || null,
        profile_photo_url || null,
        facebook_id    || null,
        google_id      || null,
      ]
    );
    return result.insertId;
  },

  // Link a social provider ID to an existing account
  async linkSocialId(userId, { facebook_id, google_id }) {
    if (facebook_id) {
      await pool.query('UPDATE users SET facebook_id = ? WHERE user_id = ?', [facebook_id, userId]);
    }
    if (google_id) {
      await pool.query('UPDATE users SET google_id = ? WHERE user_id = ?', [google_id, userId]);
    }
  },

  async existsByEmail(email) {
    const [rows] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
    return rows.length > 0;
  },

  async existsByPhone(phone) {
    const [rows] = await pool.query('SELECT user_id FROM users WHERE phone = ?', [phone]);
    return rows.length > 0;
  },

  async verify(userId) {
    await pool.query('UPDATE users SET is_verified = 1 WHERE user_id = ?', [userId]);
  },

  async updatePassword(userId, password_hash) {
    await pool.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [password_hash, userId]);
  },

  // Dynamic update for whitelisted fields only
  // sets: 'field1=?, field2=?' — values must have userId as last element
  async updateFields(sets, values) {
    await pool.query(`UPDATE users SET ${sets} WHERE user_id = ?`, values);
  },

  async getCurrentStep(userId) {
    const [rows] = await pool.query('SELECT current_step FROM users WHERE user_id = ?', [userId]);
    return rows[0]?.current_step || 1;
  },

  async setCurrentStep(userId, step) {
    await pool.query('UPDATE users SET current_step = ? WHERE user_id = ?', [step, userId]);
  },

  // Get user IDs to exclude from matching (already swiped or matched)
  async getExcludedUserIds(userId) {
    const [rows] = await pool.query(`
      SELECT DISTINCT to_user AS excluded_id FROM swipes WHERE from_user = ?
      UNION
      SELECT DISTINCT from_user AS excluded_id FROM swipes WHERE to_user = ?
      UNION
      SELECT ? AS excluded_id
    `, [userId, userId, userId]);
    return rows.map(r => r.excluded_id);
  },

  async findPotentialMatches({ userId, gender, minAge, maxAge, excludedIds }) {
    let query = `SELECT * FROM users WHERE user_id != ? AND is_verified = 1`;
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
      query += ` AND user_id NOT IN (${excludedIds.map(() => '?').join(',')})`;
      params.push(...excludedIds);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }
};

module.exports = User;
