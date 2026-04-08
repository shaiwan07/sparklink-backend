const pool = require('../config/db');

const Report = {
  async create({ reporter_id, reported_id, reason }) {
    await pool.query('INSERT INTO reports (reporter_id, reported_id, reason, created_at) VALUES (?, ?, ?, NOW())', [reporter_id, reported_id, reason]);
  }
};

module.exports = Report;
