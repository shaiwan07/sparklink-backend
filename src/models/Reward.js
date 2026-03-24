const pool = require('../config/db');

const Reward = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM rewards WHERE expiration_date >= CURDATE()');
    return rows;
  }
};

const UserOffer = {
  async getUserOffers(user_id) {
    const [rows] = await pool.query(
      'SELECT uo.*, r.name, r.description, r.discount_percent, r.qr_code_url, r.expiration_date FROM useroffers uo JOIN rewards r ON uo.offer_id = r.id WHERE uo.user_id=?',
      [user_id]
    );
    return rows;
  },
  async redeemOffer(user_id, offer_id) {
    await pool.query(
      'INSERT INTO useroffers (user_id, offer_id, redeemed_at) VALUES (?, ?, NOW())',
      [user_id, offer_id]
    );
  }
};

module.exports = { Reward, UserOffer };
