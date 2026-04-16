const VideoCall = require('../models/VideoCall');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const { buildChannelName, generateRtcToken } = require('../services/agoraService');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// ─────────────────────────────────────────────────────────────
// POST /api/video-calls
// Body: { match_id, scheduled_time? }
//
// Returns: { call_id, channelName, rtcToken, uid, appId }
// Both participants call this with the same match_id — the first
// call creates the record; the second call fetches & re-generates
// a token for their own uid.
// ─────────────────────────────────────────────────────────────
exports.scheduleCall = async (req, res) => {
  try {
    const caller_id = req.user.id;
    const { match_id, scheduled_time } = req.body;

    if (!match_id) {
      return res.status(400).json(apiResponse({
        status: false,
        message: 'match_id is required',
        data: []
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

    // Check if a call already exists for this match
    let existing = await VideoCall.getByMatchId(match_id);
    let channelName, call_id;

    if (existing && existing.channel_name) {
      // Re-use existing channel so both users land in the same room
      channelName = existing.channel_name;
      call_id     = existing.call_id;
    } else {
      // First user to call — create the record
      channelName = buildChannelName(match_id);
      call_id     = await VideoCall.schedule(
        match_id,
        scheduled_time || null,
        channelName,
        null  // token stored per-request, not in DB (changes per uid)
      );

      // Notify both participants
      const timeStr = scheduled_time
        ? new Date(scheduled_time).toLocaleString()
        : 'now';
      const msg = `Your video call has been scheduled for ${timeStr}`;
      Promise.all([
        Notification.create(match.user1_id, 'video_call', msg, { call_id: String(call_id) }),
        Notification.create(match.user2_id, 'video_call', msg, { call_id: String(call_id) }),
      ]).catch(() => {});
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
        appId: process.env.AGORA_APP_ID,
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
