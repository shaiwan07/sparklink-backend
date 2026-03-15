const pool = require('../config/db');

const Location = {
  async upsert(user_id, latitude, longitude) {
    // Upsert location for user
    const [rows] = await pool.query('SELECT id FROM Location WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
      await pool.query('UPDATE Location SET latitude=?, longitude=?, updated_at=NOW() WHERE user_id=?', [latitude, longitude, user_id]);
    } else {
      await pool.query('INSERT INTO Location (user_id, latitude, longitude) VALUES (?, ?, ?)', [user_id, latitude, longitude]);
    }
  },
  async get(user_id) {
    const [rows] = await pool.query('SELECT latitude, longitude FROM Location WHERE user_id = ?', [user_id]);
    return rows[0] || null;
  }
};

module.exports = Location;
