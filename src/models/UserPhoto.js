const pool = require('../config/db');

const UserPhoto = {
  async add(user_id, photo_url) {
    await pool.query('INSERT INTO user_photos (user_id, photo_url) VALUES (?, ?)', [user_id, photo_url]);
  },

  async getAll(user_id) {
    const [rows] = await pool.query(
      'SELECT photo_id, photo_url FROM user_photos WHERE user_id = ?',
      [user_id]
    );
    return rows;
  },

  async getById(user_id, photo_id) {
    const [rows] = await pool.query(
      'SELECT photo_id, photo_url FROM user_photos WHERE user_id = ? AND photo_id = ?',
      [user_id, photo_id]
    );
    return rows[0] || null;
  },

  async delete(user_id, photo_id) {
    await pool.query(
      'DELETE FROM user_photos WHERE user_id = ? AND photo_id = ?',
      [user_id, photo_id]
    );
  }
};

module.exports = UserPhoto;
