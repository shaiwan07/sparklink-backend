const pool = require('../config/db');

const Location = {
  async upsert(user_id, latitude, longitude, city = null) {
    const [rows] = await pool.query('SELECT id FROM user_location WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
      await pool.query(
        'UPDATE user_location SET latitude = ?, longitude = ?, city = COALESCE(?, city), updated_at = NOW() WHERE user_id = ?',
        [latitude, longitude, city, user_id]
      );
    } else {
      await pool.query(
        'INSERT INTO user_location (user_id, latitude, longitude, city) VALUES (?, ?, ?, ?)',
        [user_id, latitude, longitude, city]
      );
    }
  },

  async updateCity(user_id, city) {
    const [rows] = await pool.query('SELECT id FROM user_location WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
      await pool.query('UPDATE user_location SET city = ? WHERE user_id = ?', [city, user_id]);
    } else {
      await pool.query('INSERT INTO user_location (user_id, city) VALUES (?, ?)', [user_id, city]);
    }
  },

  async get(user_id) {
    const [rows] = await pool.query(
      'SELECT latitude, longitude, city FROM user_location WHERE user_id = ?',
      [user_id]
    );
    return rows[0] || null;
  }
};

module.exports = Location;
