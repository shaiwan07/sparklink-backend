const pool = require('../config/db');

const Profile = {
  async create({ user_id, name, gender, dob, bio, interests, photos }) {
    await pool.query(
      'INSERT INTO profiles (user_id, name, gender, dob, bio, interests, photos) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, name, gender, dob, bio || '', interests || '', JSON.stringify(photos || [])]
    );
  },
  async getByUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM profiles WHERE user_id = ?', [user_id]);
    return rows[0];
  },
  async update({ user_id, name, gender, dob, bio, interests, photos }) {
    await pool.query(
      'UPDATE profiles SET name=?, gender=?, dob=?, bio=?, interests=?, photos=? WHERE user_id=?',
      [name, gender, dob, bio, interests, JSON.stringify(photos || []), user_id]
    );
  },
  async updatePhotos(user_id, photos) {
    await pool.query('UPDATE profiles SET photos=? WHERE user_id=?', [JSON.stringify(photos), user_id]);
  }
};

module.exports = Profile;
