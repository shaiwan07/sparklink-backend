const pool = require('../config/db');

const MAX_REQUESTS = 3;

const AvailabilityRequest = {
  MAX_REQUESTS,

  // Returns current request_count (0 if never requested)
  async getCount(match_id, from_user_id) {
    const [rows] = await pool.query(
      'SELECT request_count FROM availability_requests WHERE match_id = ? AND from_user_id = ?',
      [match_id, from_user_id]
    );
    return rows[0]?.request_count ?? 0;
  },

  // Atomically inserts or increments the counter.
  // Returns the new count after increment.
  async increment(match_id, from_user_id, to_user_id) {
    await pool.query(
      `INSERT INTO availability_requests (match_id, from_user_id, to_user_id, request_count)
       VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE request_count = request_count + 1`,
      [match_id, from_user_id, to_user_id]
    );
    return this.getCount(match_id, from_user_id);
  },
};

module.exports = AvailabilityRequest;
