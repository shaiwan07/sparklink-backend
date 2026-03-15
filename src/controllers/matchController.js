const Match = require('../models/Match');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

exports.likeUser = async (req, res) => {
  try {
    const user1_id = req.user.id;
    const { user2_id } = req.body;
    if (!user2_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user2_id required', data: [] }));
    }
    const result = await Match.likeUser(user1_id, user2_id);
    res.status(200).json(apiResponse({ status: true, message: result === 'matched' ? 'Matched!' : 'Like sent', data: [result] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.dislikeUser = async (req, res) => {
  try {
    const user1_id = req.user.id;
    const { user2_id } = req.body;
    if (!user2_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user2_id required', data: [] }));
    }
    await Match.dislikeUser(user1_id, user2_id);
    res.status(200).json(apiResponse({ status: true, message: 'Dislike sent', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.getMatches = async (req, res) => {
  try {
    const user_id = req.user.id;
    const matches = await Match.getMatches(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Matches fetched', data: matches }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.unmatch = async (req, res) => {
  try {
    const user1_id = req.user.id;
    const { user2_id } = req.body;
    if (!user2_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user2_id required', data: [] }));
    }
    await Match.unmatch(user1_id, user2_id);
    res.status(200).json(apiResponse({ status: true, message: 'Unmatched', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.block = async (req, res) => {
  try {
    const user1_id = req.user.id;
    const { user2_id } = req.body;
    if (!user2_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user2_id required', data: [] }));
    }
    await Match.block(user1_id, user2_id);
    res.status(200).json(apiResponse({ status: true, message: 'Blocked', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
