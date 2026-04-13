const admin = require('firebase-admin');
const path = require('path');

// Initialize once
if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Option A: inline JSON string in env (preferred for production/CI)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Option B: path to the JSON key file on disk
    // If FIREBASE_KEY_PATH is set, resolve it relative to process.cwd() (project root).
    // Default falls back to a path relative to this file (src/helpers/ → project root).
    const keyPath = process.env.FIREBASE_KEY_PATH
      ? path.resolve(process.cwd(), process.env.FIREBASE_KEY_PATH)
      : path.join(__dirname, '../../sparklink-firebase.json');
    credential = admin.credential.cert(keyPath);
  }

  admin.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID || 'sparklink-cf252',
  });
}

/**
 * Send a push notification to a single device.
 * Silently swips if token is null/undefined (device not registered).
 *
 * @param {string|null} fcmToken  - The device FCM token stored in users.fcm_token
 * @param {string}      title     - Notification title
 * @param {string}      body      - Notification body text
 * @param {object}      [data={}] - Optional key-value payload (all values must be strings)
 * @returns {Promise<string|null>} message ID on success, null if skipped
 */
async function sendPushNotification(fcmToken, title, body, data = {}) {
  if (!fcmToken) return null;

  const message = {
    token: fcmToken,
    notification: { title, body },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
    android: {
      priority: 'high',
      notification: { sound: 'default' },
    },
    apns: {
      payload: { aps: { sound: 'default' } },
    },
  };

  try {
    const messageId = await admin.messaging().send(message);
    return messageId;
  } catch (err) {
    // Stale / invalid token — log but don't crash the caller
    console.error('[FCM] send failed:', err.code, err.message);
    return null;
  }
}

module.exports = { sendPushNotification };
