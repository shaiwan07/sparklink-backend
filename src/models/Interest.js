const pool = require('../config/db');

const Interest = {
  async setUserInterests(user_id, interest_ids) {
    await pool.query('DELETE FROM UserInterests WHERE user_id = ?', [user_id]);
    if (Array.isArray(interest_ids) && interest_ids.length > 0) {
      const values = interest_ids.map(id => [user_id, id]);
      await pool.query('INSERT INTO UserInterests (user_id, interest_id) VALUES ?', [values]);
    }
  },
  async getUserInterests(user_id) {
    const [rows] = await pool.query('SELECT i.id, i.name FROM UserInterests ui JOIN Interests i ON ui.interest_id = i.id WHERE ui.user_id = ?', [user_id]);
    return rows;
  }
  ,
  async getAll() {
    const [rows] = await pool.query('SELECT id, name, icon_url FROM Interests');
    return rows;
  }
};

module.exports = Interest;
