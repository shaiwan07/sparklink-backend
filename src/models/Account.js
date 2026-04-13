const pool = require('../config/db');

// Whitelist of user-editable settings columns to prevent SQL injection
const ALLOWED_SETTINGS = ['language'];

const Account = {
  async deleteAccount(user_id) {
    // Cascading deletes handle related tables via FK constraints
    await pool.query('DELETE FROM users WHERE user_id = ?', [user_id]);
  },

  async updateSettings(user_id, settings) {
    const filtered = {};
    for (const key of ALLOWED_SETTINGS) {
      if (settings[key] !== undefined) filtered[key] = settings[key];
    }
    if (Object.keys(filtered).length === 0) return;

    const sets = Object.keys(filtered).map(f => `${f} = ?`).join(', ');
    const values = [...Object.values(filtered), user_id];
    await pool.query(`UPDATE users SET ${sets} WHERE user_id = ?`, values);
  }
};

module.exports = Account;
