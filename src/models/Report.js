const pool = require('../config/db');

const Report = {
  async create({ reporter_id, reported_id, reason }) {
    const [result] = await pool.query(
      'INSERT INTO reports (reporter_id, reported_id, reason) VALUES (?, ?, ?)',
      [reporter_id, reported_id, reason]
    );
    return result.insertId;
  }
};

module.exports = { Report };
