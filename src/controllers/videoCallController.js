const VideoCall = require('../models/VideoCall');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// POST /api/video-calls
exports.scheduleCall = async (req, res) => {
  try {
    const { match_id, scheduled_time } = req.body;
    if (!match_id || !scheduled_time) {
      return res.status(400).json(apiResponse({ status: false, message: 'match_id and scheduled_time required', data: [] }));
    }

    const call_id = await VideoCall.schedule(match_id, scheduled_time);

    // Notify both participants
    const match = await Match.getMatchById(match_id);
    if (match) {
      const timeStr = new Date(scheduled_time).toLocaleString();
      const msg = `Your video call has been scheduled for ${timeStr}`;
      Promise.all([
        Notification.create(match.user1_id, 'video_call', msg, { call_id: String(call_id) }),
        Notification.create(match.user2_id, 'video_call', msg, { call_id: String(call_id) }),
      ]).catch(() => {});
    }

    res.status(200).json(apiResponse({ status: true, message: 'Video call scheduled', data: [{ call_id }] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/video-calls
exports.getUserCalls = async (req, res) => {
  try {
    const user_id = req.user.id;
    const calls = await VideoCall.getUserCalls(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Video calls fetched', data: calls }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/video-calls/:match_id
exports.getCallByMatchId = async (req, res) => {
  try {
    const { match_id } = req.params;
    if (!match_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'match_id required', data: [] }));
    }
    const call = await VideoCall.getByMatchId(match_id);
    if (!call) {
      return res.status(404).json(apiResponse({ status: false, message: 'No scheduled call found', data: [] }));
    }
    res.status(200).json(apiResponse({ status: true, message: 'Scheduled call fetched', data: call }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/video-calls/status
exports.updateStatus = async (req, res) => {
  try {
    const { call_id, status } = req.body;
    if (!call_id || !status) {
      return res.status(400).json(apiResponse({ status: false, message: 'call_id and status required', data: [] }));
    }
    await VideoCall.updateStatus(call_id, status);
    res.status(200).json(apiResponse({ status: true, message: 'Video call status updated', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
