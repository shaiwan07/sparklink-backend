const pool = require('../config/db');

const Availability = {
  async getByUser(user_id) {
    const [rows] = await pool.query(
      'SELECT id, day_of_week, start_time, end_time FROM availability WHERE user_id = ? ORDER BY FIELD(day_of_week,"Mon","Tue","Wed","Thu","Fri","Sat","Sun"), start_time',
      [user_id]
    );
    return rows;
  },

  async set(user_id, slots) {
    // Replace all slots for this user
    await pool.query('DELETE FROM availability WHERE user_id = ?', [user_id]);
    if (!slots || slots.length === 0) return;
    const values = slots.map(s => [user_id, s.day_of_week, s.start_time, s.end_time]);
    await pool.query(
      'INSERT INTO availability (user_id, day_of_week, start_time, end_time) VALUES ?',
      [values]
    );
  },

  // Returns a Set of user_ids (from the given array) who have at least one availability slot
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
      'SELECT id, user_id, day_of_week, start_time, end_time FROM availability WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Returns overlapping slots including the caller's availability_id so
  // Flutter can pass it straight to POST /api/video-calls.
  async getOverlap(user1_id, user2_id, day_of_week) {
    const [rows] = await pool.query(
      `SELECT
         a1.id                                      AS availability_id,
         a1.day_of_week,
         GREATEST(a1.start_time, a2.start_time)     AS overlap_start,
         LEAST(a1.end_time,   a2.end_time)          AS overlap_end
       FROM availability a1
       JOIN availability a2 ON a1.day_of_week = a2.day_of_week
       WHERE a1.user_id = ? AND a2.user_id = ?
         AND (? IS NULL OR a1.day_of_week = ?)
         AND a1.start_time < a2.end_time
         AND a1.end_time   > a2.start_time`,
      [user1_id, user2_id, day_of_week || null, day_of_week || null]
    );
    return rows.filter(r => r.overlap_start < r.overlap_end);
  }
};

module.exports = Availability;
