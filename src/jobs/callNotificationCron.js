const cron = require('node-cron');
const VideoCall = require('../models/VideoCall');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Runs every minute.
// 1. Sends a push notification ~10 min before each scheduled call (window: 9–11 min).
// 2. Auto-expires calls whose 20-min window has passed.
function startCallNotificationCron() {
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

    await Promise.all([
      Notification.create(
        call.user1_id,
        'video_call',
        msgFor(user2?.full_name),
        { call_id: String(call.call_id) },
        call.call_id
      ),
      Notification.create(
        call.user2_id,
        'video_call',
        msgFor(user1?.full_name),
        { call_id: String(call.call_id) },
        call.call_id
      ),
      VideoCall.markNotified(call.call_id),
    ]);
  }
}

module.exports = { startCallNotificationCron };
