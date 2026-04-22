const VideoCall = require('../models/VideoCall');
const Match = require('../models/Match');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { buildChannelName, generateRtcToken } = require('../services/agoraService');
const MSG = require('../constants/error');
const { sendSMS, SMS } = require('../helpers/smsHelper');

const DAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// Returns the next wall-clock datetime for a given day + time (recurring weekly slot)
function nextOccurrence(dayOfWeek, startTime) {
  const targetDay = DAY_MAP[dayOfWeek];
  const [hh, mm] = startTime.split(':').map(Number);
  const now  = new Date();
  const next = new Date(now);
  next.setHours(hh, mm, 0, 0);
  let daysUntil = (targetDay - now.getDay() + 7) % 7;
  if (daysUntil === 0 && next <= now) daysUntil = 7; // same day but time already passed
  next.setDate(next.getDate() + daysUntil);
  return next;
}

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// ─────────────────────────────────────────────────────────────
// POST /api/video-calls
// Body: { match_id, availability_id }
//
// Flow:
//   1. Look up the availability slot (must belong to one match participant).
//   2. Verify the other participant has an overlapping slot on the same day.
//   3. Derive scheduled_time as the next wall-clock occurrence of that day+time.
//   4. Create the Agora channel. Both users call this endpoint — the second
//      caller re-uses the existing channel and gets their own RTC token.
//
// Returns: { call_id, channelName, rtcToken, uid, appId, scheduled_time }
// ─────────────────────────────────────────────────────────────
exports.scheduleCall = async (req, res) => {
  try {
    const caller_id = req.user.id;
    const { match_id, availability_id } = req.body;

    if (!match_id || !availability_id) {
      return res.status(400).json(apiResponse({
        status: false,
        message: 'match_id and availability_id are required',
        data: []
      }));
    }

    // Block if user is already in an active call
    const activeCall = await VideoCall.getActiveCall(caller_id);
    if (activeCall) {
      return res.status(409).json(apiResponse({
        status: false,
        message: 'You are already in an active call',
        data: [{ call_id: activeCall.call_id }]
      }));
    }

    // Verify caller is a participant in this match
    const match = await Match.getMatchById(match_id);
    if (!match || (match.user1_id !== caller_id && match.user2_id !== caller_id)) {
      return res.status(403).json(apiResponse({
        status: false,
        message: 'Not authorized for this match',
        data: []
      }));
    }

    // Look up the chosen availability slot
    const slot = await Availability.getById(availability_id);
    if (!slot) {
      return res.status(404).json(apiResponse({
        status: false,
        message: 'Availability slot not found',
        data: []
      }));
    }

    // The slot must belong to one of the two match participants
    const slotOwner = slot.user_id;
    const otherUser = match.user1_id === slotOwner ? match.user2_id : match.user1_id;
    if (slotOwner !== match.user1_id && slotOwner !== match.user2_id) {
      return res.status(400).json(apiResponse({
        status: false,
        message: 'Availability slot does not belong to a participant of this match',
        data: []
      }));
    }

    // Verify the other participant has an overlapping slot on the same day
    const overlaps = await Availability.getOverlap(slotOwner, otherUser, slot.day_of_week);
    if (overlaps.length === 0) {
      return res.status(400).json(apiResponse({
        status: false,
        message: `No availability overlap on ${slot.day_of_week}. Both users must have matching time slots.`,
        data: []
      }));
    }

    // Derive the next real-world datetime for this recurring slot
    const scheduled_time = nextOccurrence(slot.day_of_week, slot.start_time);

    // Check if a call already exists for this match
    let existing = await VideoCall.getByMatchId(match_id);
    let channelName, call_id;

    if (existing && existing.channel_name) {
      // Reject if the previous call window has closed
      if (['expired', 'cancelled', 'completed'].includes(existing.status)) {
        return res.status(410).json(apiResponse({
          status: false,
          message: `Previous call is ${existing.status}. Please schedule a new one.`,
          data: []
        }));
      }
      // Re-use existing channel so both users land in the same Agora room
      channelName = existing.channel_name;
      call_id     = existing.call_id;
      // Mark active once a second participant joins
      if (existing.status === 'scheduled') {
        await VideoCall.updateStatus(call_id, 'active');
      }
    } else {
      // First caller — create the call record
      channelName = buildChannelName(match_id);
      call_id     = await VideoCall.schedule(
        match_id,
        scheduled_time,
        channelName,
        null  // token is per-uid, generated fresh each request
      );

      // Notify both participants
      const timeStr = scheduled_time.toLocaleString();
      const msg = `Your video call has been scheduled for ${timeStr}`;
      Promise.all([
        Notification.create(match.user1_id, 'video_call', msg, { call_id: String(call_id) }, call_id),
        Notification.create(match.user2_id, 'video_call', msg, { call_id: String(call_id) }, call_id),
      ]).catch(() => {});

      const [u1, u2] = await Promise.all([User.findById(match.user1_id), User.findById(match.user2_id)]);
      sendSMS(u1?.phone, SMS.callScheduled(u2?.full_name || 'your match', timeStr)).catch(() => {});
      sendSMS(u2?.phone, SMS.callScheduled(u1?.full_name || 'your match', timeStr)).catch(() => {});
    }

    // Generate a caller-specific RTC token (uid = user_id)
    const uid = caller_id;
    const rtcToken = generateRtcToken(channelName, uid);

    return res.status(200).json(apiResponse({
      status:  true,
      message: 'Video call ready',
      data: [{
        call_id,
        channelName,
        rtcToken,
        uid,
        appId:          process.env.AGORA_APP_ID,
        scheduled_time: existing ? existing.scheduled_time : scheduled_time,
      }]
    }));

  } catch (err) {
    console.error('[VideoCall]', err.message);
    // Surface Agora config errors clearly
    if (err.message.includes('AGORA_APP')) {
      return res.status(500).json(apiResponse({
        status: false,
        message: err.message,
        data: []
      }));
    }
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/video-calls
// Returns all calls the logged-in user is part of
// ─────────────────────────────────────────────────────────────
exports.getUserCalls = async (req, res) => {
  try {
    const user_id = req.user.id;
    const calls = await VideoCall.getUserCalls(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Video calls fetched', data: calls }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/video-calls/:match_id
// ─────────────────────────────────────────────────────────────
exports.getCallByMatchId = async (req, res) => {
  try {
    const { match_id } = req.params;
    const call = await VideoCall.getByMatchId(match_id);
    if (!call) {
      return res.status(404).json(apiResponse({ status: false, message: 'No call found for this match', data: [] }));
    }
    res.status(200).json(apiResponse({ status: true, message: 'Call fetched', data: call }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/video-calls/status
// Body: { call_id, status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' }
// ─────────────────────────────────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { call_id, status } = req.body;
    const VALID = ['scheduled', 'ongoing', 'completed', 'cancelled', 'failed'];

    if (!call_id || !status) {
      return res.status(400).json(apiResponse({ status: false, message: 'call_id and status required', data: [] }));
    }
    if (!VALID.includes(status)) {
      return res.status(400).json(apiResponse({
        status: false,
        message: `status must be one of: ${VALID.join(', ')}`,
        data: []
      }));
    }

    await VideoCall.updateStatus(call_id, status);
    res.status(200).json(apiResponse({ status: true, message: 'Status updated', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
