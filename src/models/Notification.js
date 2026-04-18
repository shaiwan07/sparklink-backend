const pool = require('../config/db');
const { sendPushNotification } = require('../helpers/firebaseHelper');

const TITLES = {
  liked:      'Someone liked you! 👀',
  superliked: 'You got a Superlike! ⭐',
  new_match:  "It's a Match! 🎉",
  video_call: 'Video Call Scheduled 📅',
  reward:     'New Reward Available 🎁',
  message:    'New Message 💬',
};

const Notification = {
  async getAll(user_id) {
    const [rows] = await pool.query(
      `SELECT id, user_id, type, message, reference_id, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
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
   * Create an in-app notification + send FCM push.
   *
   * @param {number}      user_id      - Recipient
   * @param {string}      type         - e.g. 'liked', 'new_match', 'video_call'
   * @param {string}      message      - Notification body
   * @param {object}      [data={}]    - Extra FCM payload (all values must be strings)
   * @param {number|null} [reference_id] - e.g. from_user_id for likes, match_id for matches
   */
  async create(user_id, type, message, data = {}, reference_id = null) {
    // 1. Save in-app notification
    await pool.query(
      'INSERT INTO notifications (user_id, type, message, reference_id) VALUES (?, ?, ?, ?)',
      [user_id, type, message, reference_id || null]
    );

    // 2. Fire push notification (never blocks the caller)
    try {
      const [rows] = await pool.query(
        'SELECT fcm_token FROM users WHERE user_id = ?',
        [user_id]
      );
      const fcmToken = rows[0]?.fcm_token || null;
      const title = TITLES[type] || 'SparkLink';

      // Always include reference_id in FCM data payload so the app can navigate
      const fcmData = {
        ...data,
        type,
        ...(reference_id ? { reference_id: String(reference_id) } : {}),
      };

      sendPushNotification(fcmToken, title, message, fcmData).catch(() => {});
    } catch (_) {
      // FCM errors must never surface to API callers
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
