const VideoCall = require('../models/VideoCall');
const Match = require('../models/Match');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { buildChannelName, generateRtcToken } = require('../services/agoraService');
const MSG = require('../constants/error');
const { sendSMS, SMS } = require('../helpers/smsHelper');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// ─────────────────────────────────────────────────────────────
// POST /api/video-calls
// Body: { match_id, availability_id }
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

    // Prevent duplicate: reject if a scheduled/active call already exists for this match
    const existingScheduled = await VideoCall.getScheduledForMatch(match_id);
    if (existingScheduled) {
      return res.status(409).json(apiResponse({
        status: false,
        message: 'A call is already scheduled for this match. Cannot schedule another.',
        data: [{ call_id: existingScheduled.call_id, scheduled_time: existingScheduled.scheduled_time }]
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

    // Verify the other participant has a matching slot on the same date+time
    const overlaps = await Availability.getOverlap(slotOwner, otherUser, slot.slot_date);
    const hasOverlap = overlaps.some(o => String(o.slot_time).slice(0, 5) === String(slot.slot_time).slice(0, 5));
    if (!hasOverlap) {
      return res.status(400).json(apiResponse({
        status: false,
        message: `No availability overlap on ${slot.slot_date}. Both users must have matching time slots.`,
        data: []
      }));
    }

    // Build scheduled_time from slot_date + slot_time
    const scheduled_time = new Date(`${slot.slot_date}T${slot.slot_time}`);

    // Prevent time conflict: neither user can have another call at this same time
    const [callerConflict, otherConflict] = await Promise.all([
      VideoCall.hasConflictAtTime(caller_id, scheduled_time),
      VideoCall.hasConflictAtTime(otherUser, scheduled_time),
    ]);
    if (callerConflict) {
      return res.status(409).json(apiResponse({
        status: false,
        message: 'You already have a call scheduled at this time.',
        data: [{ conflicting_call_id: callerConflict.call_id }]
      }));
    }
    if (otherConflict) {
      return res.status(409).json(apiResponse({
        status: false,
        message: 'The other user already has a call scheduled at this time.',
        data: []
      }));
    }

    // Create the call record
    const channelName = buildChannelName(match_id);
    const call_id = await VideoCall.schedule(
      match_id,
      scheduled_time,
      channelName,
      null
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

    // Generate a caller-specific RTC token
    const uid = caller_id;
    const rtcToken = generateRtcToken(channelName, uid);

    return res.status(200).json(apiResponse({
      status:  true,
      message: 'Video call scheduled',
      data: [{
        call_id,
        channelName,
        rtcToken,
        uid,
        appId:          process.env.AGORA_APP_ID,
        scheduled_time,
      }]
    }));

  } catch (err) {
    console.error('[VideoCall]', err.message);
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

// Shapes a raw DB call row into the response format
function shapeCall(call, uid) {
  const channelName = call.channel_name || null;
  return {
    call_id:        call.call_id,
    match_id:       call.match_id,
    status:         call.status,
    channelName,
    rtcToken:       channelName ? generateRtcToken(channelName, uid) : null,
    uid,
    appId:          process.env.AGORA_APP_ID,
    scheduled_time: call.scheduled_time,
    expires_at:     call.expires_at,
  };
}

// ─────────────────────────────────────────────────────────────
// GET /api/video-calls
// ─────────────────────────────────────────────────────────────
exports.getUserCalls = async (req, res) => {
  try {
    const uid = req.user.id;
    const calls = await VideoCall.getUserCalls(uid);
    const data = calls.map(c => shapeCall(c, uid));
    res.status(200).json(apiResponse({ status: true, message: 'Video calls fetched', data }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/video-calls/:match_id
// ─────────────────────────────────────────────────────────────
exports.getCallByMatchId = async (req, res) => {
  try {
    const uid = req.user.id;
    const { match_id } = req.params;
    const call = await VideoCall.getByMatchId(match_id);
    if (!call) {
      return res.status(404).json(apiResponse({ status: false, message: 'No call found for this match', data: [] }));
    }
    res.status(200).json(apiResponse({ status: true, message: 'Call fetched', data: [shapeCall(call, uid)] }));
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
