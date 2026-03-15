const pool = require('../config/db');

const Account = {
  async deleteAccount(user_id) {
    await pool.query('DELETE FROM Users WHERE id=?', [user_id]);
  },
  async updateSettings(user_id, settings) {
    // Example: settings = { privacy: 'private', notifications: true }
    const fields = Object.keys(settings).map(f => `${f}=?`).join(', ');
    const values = Object.values(settings);
    values.push(user_id);
    await pool.query(`UPDATE Users SET ${fields} WHERE id=?`, values);
  }
};

module.exports = Account;
