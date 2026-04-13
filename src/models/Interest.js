const pool = require('../config/db');

const Interest = {
  async getAll() {
    const [rows] = await pool.query('SELECT interest_id, name, icon_url FROM interests_master ORDER BY interest_id');
    return rows;
  },

  async getUserInterests(user_id) {
    const [rows] = await pool.query(
      `SELECT im.interest_id, im.name, im.icon_url
       FROM user_interests ui
       JOIN interests_master im ON ui.interest_id = im.interest_id
       WHERE ui.user_id = ?`,
      [user_id]
    );
    return rows;
  },

  async setUserInterests(user_id, interest_ids) {
    await pool.query('DELETE FROM user_interests WHERE user_id = ?', [user_id]);
    if (Array.isArray(interest_ids) && interest_ids.length > 0) {
      const values = interest_ids.map(id => [user_id, id]);
      await pool.query('INSERT INTO user_interests (user_id, interest_id) VALUES ?', [values]);
    }
  }
};

module.exports = Interest;
