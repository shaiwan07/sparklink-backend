const cron = require('node-cron');
const pool = require('../config/db');
const VideoCall = require('../models/VideoCall');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { generateRtcToken } = require('../services/agoraService');
const { sendSMS, SMS } = require('../helpers/smsHelper');

// Runs every minute:
//   1. Sends push ~10 min before each scheduled call.
//   2. Auto-expires calls whose 20-min window has passed.
// Runs every 4 hours:
//   3. Reminds matched users who haven't scheduled a call yet (up to 48 h after match).
function startCallNotificationCron() {
  // Every minute — pre-call reminders + expiry
  cron.schedule('* * * * *', async () => {
    try {
      await Promise.all([
        notifyUpcomingCalls(),
        VideoCall.expireStale(),
      ]);
    } catch (err) {
      console.error('[Cron] callNotification error:', err.message);
    }
  });

  // Every 4 hours — scheduling reminders for unscheduled matches
  cron.schedule('0 */4 * * *', async () => {
    try {
      await notifyUnscheduledMatches();
    } catch (err) {
      console.error('[Cron] unscheduledMatches error:', err.message);
    }
  });

  console.log('[Cron] Call notification cron started');
}

async function notifyUpcomingCalls() {
  // Find calls starting in 9–11 min (catches the minute precisely)
  const calls = await VideoCall.getUpcomingUnnotified(9, 11);

  for (const call of calls) {
    const [user1, user2] = await Promise.all([
      User.findById(call.user1_id),
      User.findById(call.user2_id),
    ]);

    const msgFor = (otherName) =>
      `Your video call with ${otherName || 'your match'} starts in 10 minutes!`;

    // Generate a fresh Agora token for each participant
    const token1 = call.channel_name ? generateRtcToken(call.channel_name, call.user1_id) : null;
    const token2 = call.channel_name ? generateRtcToken(call.channel_name, call.user2_id) : null;

    // Notification data payload — Flutter uses this to join the call directly
    const dataFor = (uid, rtcToken) => ({
      call_id:        String(call.call_id),
      channel_name:   call.channel_name  || '',
      rtc_token:      rtcToken           || '',
      uid:            String(uid),
      app_id:         process.env.AGORA_APP_ID || '',
      scheduled_time: call.scheduled_time ? new Date(call.scheduled_time).toISOString() : '',
    });

    await Promise.all([
      Notification.create(
        call.user1_id,
        'video_call',
        msgFor(user2?.full_name),
        dataFor(call.user1_id, token1),
        call.call_id
      ),
      Notification.create(
        call.user2_id,
        'video_call',
        msgFor(user1?.full_name),
        dataFor(call.user2_id, token2),
        call.call_id
      ),
      VideoCall.markNotified(call.call_id),
    ]);
  }
}

// Find matched pairs who have no scheduled call within 48 h of matching,
// and whose last reminder was sent more than 4 h ago (or never).
// Sends a push to both users and updates last_reminder_sent.
async function notifyUnscheduledMatches() {
  const [rows] = await pool.query(
    `SELECT m.match_id, m.user1_id, m.user2_id, m.created_at
     FROM matches m
     WHERE m.status = 'matched'
       AND m.created_at >= DATE_SUB(NOW(), INTERVAL 48 HOUR)
       AND (m.last_reminder_sent IS NULL OR m.last_reminder_sent <= DATE_SUB(NOW(), INTERVAL 4 HOUR))
       AND NOT EXISTS (
         SELECT 1 FROM video_calls vc
         WHERE vc.match_id = m.match_id
           AND vc.status NOT IN ('cancelled','expired')
       )`
  );

  for (const match of rows) {
    const [user1, user2] = await Promise.all([
      User.findById(match.user1_id),
      User.findById(match.user2_id),
    ]);

    const hoursLeft = Math.max(
      0,
      Math.round(48 - (Date.now() - new Date(match.created_at).getTime()) / 3_600_000)
    );

    await Promise.all([
      Notification.create(
        match.user1_id,
        'video_call',
        `Don't forget to schedule your video date with ${user2?.full_name || 'your match'}! You have ${hoursLeft}h left to set it up.`,
        { match_id: String(match.match_id) },
        match.match_id
      ),
      Notification.create(
        match.user2_id,
        'video_call',
        `Don't forget to schedule your video date with ${user1?.full_name || 'your match'}! You have ${hoursLeft}h left to set it up.`,
        { match_id: String(match.match_id) },
        match.match_id
      ),
      pool.query(
        'UPDATE matches SET last_reminder_sent = NOW() WHERE match_id = ?',
        [match.match_id]
      ),
    ]);

    sendSMS(user1?.phone, SMS.scheduleReminder(user2?.full_name || 'your match', hoursLeft)).catch(() => {});
    sendSMS(user2?.phone, SMS.scheduleReminder(user1?.full_name || 'your match', hoursLeft)).catch(() => {});
  }
}

module.exports = { startCallNotificationCron };
