const pool = require('../config/db');
const { sendPushNotification } = require('../helpers/firebaseHelper');

// Notification type → human-readable title map
const TITLES = {
  new_match:     'New Match! 🎉',
  video_call:    'Video Call Scheduled 📅',
  reward:        'New Reward Available 🎁',
  message:       'New Message 💬',
  default:       'SparkLink',
};

const Notification = {
  async getAll(user_id) {
    const [rows] = await pool.query(
      'SELECT id, user_id, type, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  },

  async markAsRead(user_id, notification_id) {
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [notification_id, user_id]
    );
  },

  async markAllAsRead(user_id) {
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [user_id]
    );
  },

  /**
   * Create an in-app notification AND send a push notification if the user
   * has a registered FCM token.
   */
  async create(user_id, type, message, data = {}) {
    // 1. Persist in-app notification
    await pool.query(
      'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
      [user_id, type, message]
    );

    // 2. Send push notification (fire-and-forget — don't block on FCM)
    try {
      const [rows] = await pool.query(
        'SELECT fcm_token FROM users WHERE user_id = ?',
        [user_id]
      );
      const fcmToken = rows[0]?.fcm_token || null;
      const title = TITLES[type] || TITLES.default;
      sendPushNotification(fcmToken, title, message, data).catch(() => {});
    } catch (_) {
      // Never let FCM errors surface to callers
    }
  },

  async getUnreadCount(user_id) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [user_id]
    );
    return rows[0].count;
  },
};

module.exports = Notification;
