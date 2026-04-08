const VideoCall = require('../models/VideoCall');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

exports.scheduleCall = async (req, res) => {
  try {
    const { match_id, scheduled_time } = req.body;
    if (!match_id || !scheduled_time) {
      return res.status(400).json(apiResponse({ status: false, message: 'match_id and scheduled_time required', data: [] }));
    }
    await VideoCall.schedule(match_id, scheduled_time);
    res.status(200).json(apiResponse({ status: true, message: 'Video call scheduled', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.getUserCalls = async (req, res) => {
  try {
    const user_id = req.user.id;
    const calls = await VideoCall.getUserCalls(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Video calls fetched', data: calls }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

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
