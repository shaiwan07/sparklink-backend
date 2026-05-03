const pool = require('../config/db');

const ALLOWED_TIMES = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

const Availability = {
  ALLOWED_TIMES,

  async getByUser(user_id) {
    const [rows] = await pool.query(
      'SELECT id, slot_date, slot_time FROM availability WHERE user_id = ? ORDER BY slot_date, slot_time',
      [user_id]
    );
    return rows;
  },

  async set(user_id, slots) {
    await pool.query('DELETE FROM availability WHERE user_id = ?', [user_id]);
    if (!slots || slots.length === 0) return;
    const values = slots.map(s => [user_id, s.date, s.time]);
    await pool.query(
      'INSERT INTO availability (user_id, slot_date, slot_time) VALUES ?',
      [values]
    );
  },

  async getUsersWithAvailability(userIds) {
    if (!userIds || userIds.length === 0) return new Set();
    const placeholders = userIds.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT DISTINCT user_id FROM availability WHERE user_id IN (${placeholders})`,
      userIds
    );
    return new Set(rows.map(r => r.user_id));
  },

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT id, user_id, slot_date, slot_time FROM availability WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async getOverlap(user1_id, user2_id, date) {
    let query = `SELECT
         a1.id AS availability_id,
         a1.slot_date,
         a1.slot_time
       FROM availability a1
       JOIN availability a2 ON a1.slot_date = a2.slot_date AND a1.slot_time = a2.slot_time
       WHERE a1.user_id = ? AND a2.user_id = ?`;
    const params = [user1_id, user2_id];

    if (date) {
      query += ' AND a1.slot_date = ?';
      params.push(date);
    }

    query += ' ORDER BY a1.slot_date, a1.slot_time';
    const [rows] = await pool.query(query, params);
    return rows;
  }
};

module.exports = Availability;
