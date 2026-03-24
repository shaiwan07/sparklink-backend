const pool = require('../config/db');

const UserPhoto = {
  async add(user_id, photo_url) {
    await pool.query('INSERT INTO userphotos (user_id, photo_url) VALUES (?, ?)', [user_id, photo_url]);
  },
  async getAll(user_id) {
    const [rows] = await pool.query('SELECT id, photo_url FROM userphotos WHERE user_id = ?', [user_id]);
    return rows;
  },
  async delete(user_id, photo_id) {
    await pool.query('DELETE FROM userphotos WHERE user_id = ? AND id = ?', [user_id, photo_id]);
  }
};

module.exports = UserPhoto;
