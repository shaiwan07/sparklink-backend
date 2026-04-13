const pool = require('../config/db');

const Reward = {
  async getAll() {
    const [rows] = await pool.query(
      'SELECT reward_id, name, description, discount_percent, qr_code_url, expiration_date FROM rewards WHERE expiration_date >= CURDATE() ORDER BY reward_id'
    );
    return rows;
  },

  async getById(reward_id) {
    const [rows] = await pool.query(
      'SELECT reward_id, name, description, discount_percent, qr_code_url, expiration_date FROM rewards WHERE reward_id = ?',
      [reward_id]
    );
    return rows[0] || null;
  }
};

const UserOffer = {
  async getUserOffers(user_id) {
    const [rows] = await pool.query(
      `SELECT uo.id, uo.user_id, uo.reward_id, uo.redeemed_at,
              r.name, r.description, r.discount_percent, r.qr_code_url, r.expiration_date
       FROM user_offers uo
       JOIN rewards r ON uo.reward_id = r.reward_id
       WHERE uo.user_id = ?
       ORDER BY uo.id DESC`,
      [user_id]
    );
    return rows;
  },

  async redeemOffer(user_id, reward_id) {
    await pool.query(
      'INSERT INTO user_offers (user_id, reward_id, redeemed_at) VALUES (?, ?, NOW())',
      [user_id, reward_id]
    );
  },

  async hasRedeemed(user_id, reward_id) {
    const [rows] = await pool.query(
      'SELECT id FROM user_offers WHERE user_id = ? AND reward_id = ? AND redeemed_at IS NOT NULL',
      [user_id, reward_id]
    );
    return rows.length > 0;
  }
};

module.exports = { Reward, UserOffer };
