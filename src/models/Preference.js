const pool = require('../config/db');

const ALLOWED_PREF_FIELDS = ['interested_in', 'min_age', 'max_age', 'max_distance_km', 'height_cm'];

const Preference = {
  async upsert(user_id, data) {
    // Only include provided fields so existing values are never overwritten with NULL
    const fields = ALLOWED_PREF_FIELDS.filter(f => data[f] !== undefined);
    if (fields.length === 0) return;

    const [rows] = await pool.query('SELECT id FROM preferences WHERE user_id = ?', [user_id]);

    if (rows.length > 0) {
      const sets = fields.map(f => `${f} = ?`).join(', ');
      const values = [...fields.map(f => data[f]), user_id];
      await pool.query(`UPDATE preferences SET ${sets} WHERE user_id = ?`, values);
    } else {
      const cols = ['user_id', ...fields].join(', ');
      const placeholders = ['?', ...fields.map(() => '?')].join(', ');
      const values = [user_id, ...fields.map(f => data[f])];
      await pool.query(`INSERT INTO preferences (${cols}) VALUES (${placeholders})`, values);
    }
  },

  async get(user_id) {
    const [rows] = await pool.query('SELECT * FROM preferences WHERE user_id = ?', [user_id]);
    return rows[0] || null;
  }
};

module.exports = Preference;
