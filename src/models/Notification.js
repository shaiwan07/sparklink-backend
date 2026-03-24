const pool = require('../config/db');

const Notification = {
  async getAll(user_id) {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  },
  async markAsRead(user_id, notification_id) {
    await pool.query(
      'UPDATE notifications SET is_read=TRUE WHERE id=? AND user_id=?',
      [notification_id, user_id]
    );
  }
};

module.exports = Notification;
