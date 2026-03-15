const pool = require('../config/db');

const Preference = {
  async upsert(user_id, data) {
    const [rows] = await pool.query('SELECT id FROM Preferences WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
      await pool.query('UPDATE Preferences SET interested_in=?, min_age=?, max_age=?, min_height=?, max_height=?, max_distance_km=? WHERE user_id=?', [data.interested_in, data.min_age, data.max_age, data.min_height, data.max_height, data.max_distance_km, user_id]);
    } else {
      await pool.query('INSERT INTO Preferences (user_id, interested_in, min_age, max_age, min_height, max_height, max_distance_km) VALUES (?, ?, ?, ?, ?, ?, ?)', [user_id, data.interested_in, data.min_age, data.max_age, data.min_height, data.max_height, data.max_distance_km]);
    }
  },
  async get(user_id) {
    const [rows] = await pool.query('SELECT * FROM Preferences WHERE user_id = ?', [user_id]);
    return rows[0] || null;
  }
};

module.exports = Preference;
