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

  async findByAppleId(apple_id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE apple_id = ?', [apple_id]);
    return rows[0] || null;
  },

  async create({ email, password_hash, terms_accepted = 0 }) {
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, terms_accepted) VALUES (?, ?, ?)',
      [email, password_hash, terms_accepted ? 1 : 0]
    );
    return result.insertId;
  },

  // Create a user who signed up via a social provider (no password required)
  async createSocialUser({ email, full_name, profile_photo_url, facebook_id, google_id, apple_id }) {
    const [result] = await pool.query(
      `INSERT INTO users
         (email, full_name, profile_photo_url, facebook_id, google_id, apple_id, is_verified, password_hash, terms_accepted)
       VALUES (?, ?, ?, ?, ?, ?, 1, '', 1)`,
      [
        email             || null,
        full_name         || null,
        profile_photo_url || null,
        facebook_id       || null,
        google_id         || null,
        apple_id          || null,
      ]
    );
    return result.insertId;
  },

  // Link a social provider ID to an existing account
  async linkSocialId(userId, { facebook_id, google_id, apple_id }) {
    if (facebook_id) await pool.query('UPDATE users SET facebook_id = ? WHERE user_id = ?', [facebook_id, userId]);
    if (google_id)   await pool.query('UPDATE users SET google_id   = ? WHERE user_id = ?', [google_id,   userId]);
    if (apple_id)    await pool.query('UPDATE users SET apple_id    = ? WHERE user_id = ?', [apple_id,    userId]);
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

  // Suspend a user for the given number of hours (default 24)
  async suspend(userId, hours = 24) {
    const until = new Date(Date.now() + hours * 60 * 60 * 1000);
    await pool.query(
      'UPDATE users SET suspended_until = ? WHERE user_id = ?',
      [until, userId]
    );
    return until;
  },

  // Returns the suspended_until date if currently suspended, otherwise null
  async getSuspensionStatus(userId) {
    const [rows] = await pool.query(
      'SELECT suspended_until FROM users WHERE user_id = ?',
      [userId]
    );
    const until = rows[0]?.suspended_until;
    if (!until) return null;
    return new Date(until) > new Date() ? until : null;
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

  // Only exclude self + users who blocked / were blocked by this user.
  // Liked/disliked/matched users are still shown — with interaction_status flag.
  async getExcludedUserIds(userId) {
    const [rows] = await pool.query(`
      SELECT DISTINCT
        CASE WHEN user1_id = ? THEN user2_id ELSE user1_id END AS excluded_id
      FROM matches
      WHERE (user1_id = ? OR user2_id = ?) AND status = 'blocked'
      UNION
      SELECT ? AS excluded_id
    `, [userId, userId, userId, userId]);
    return rows.map(r => r.excluded_id);
  },

  // Bulk-fetch all swipe + match data for a user in 3 queries.
  // Returns maps used to compute interaction_status without N+1 queries.
  async getInteractionMaps(userId) {
    const [mySwipeRows] = await pool.query(
      'SELECT to_user, action FROM swipes WHERE from_user = ?',
      [userId]
    );
    const [theirSwipeRows] = await pool.query(
      'SELECT from_user, action FROM swipes WHERE to_user = ?',
      [userId]
    );
    const [matchRows] = await pool.query(
      `SELECT match_id, user1_id, user2_id FROM matches
       WHERE (user1_id = ? OR user2_id = ?) AND status = 'matched'`,
      [userId, userId]
    );

    const mySwipes = {};
    for (const r of mySwipeRows) mySwipes[r.to_user] = r.action;

    const theirSwipes = {};
    for (const r of theirSwipeRows) theirSwipes[r.from_user] = r.action;

    const matchedIds = new Set();
    const matchIdMap = new Map();
    for (const r of matchRows) {
      const otherId = r.user1_id === userId ? r.user2_id : r.user1_id;
      matchedIds.add(otherId);
      matchIdMap.set(otherId, r.match_id);
    }

    return { mySwipes, theirSwipes, matchedIds, matchIdMap };
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
