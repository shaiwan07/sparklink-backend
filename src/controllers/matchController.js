const Match = require('../models/Match');
const Notification = require('../models/Notification');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// Notify both users when a mutual match happens (fire-and-forget)
async function notifyMatch(user1_id, user2_id) {
  await Promise.all([
    Notification.create(user1_id, 'new_match', "It's a Match! You both liked each other.", {}),
    Notification.create(user2_id, 'new_match', "It's a Match! You both liked each other.", {}),
  ]).catch(() => {});
}

// POST /api/matches/like
exports.likeUser = async (req, res) => {
  try {
    const from_user = req.user.id;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user_id required', data: [] }));
    }
    const result = await Match.likeUser(from_user, parseInt(user_id));
    if (result.result === 'matched') {
      notifyMatch(from_user, parseInt(user_id));
    }
    const message = result.result === 'matched' ? "It's a Match!" : 'Like sent';
    res.status(200).json(apiResponse({ status: true, message, data: [result] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/matches/superlike
exports.superlikeUser = async (req, res) => {
  try {
    const from_user = req.user.id;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user_id required', data: [] }));
    }
    const result = await Match.superlikeUser(from_user, parseInt(user_id));
    if (result.result === 'matched') {
      notifyMatch(from_user, parseInt(user_id));
    }
    const message = result.result === 'matched' ? "It's a Match!" : 'Superlike sent';
    res.status(200).json(apiResponse({ status: true, message, data: [result] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/matches/dislike
exports.dislikeUser = async (req, res) => {
  try {
    const from_user = req.user.id;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user_id required', data: [] }));
    }
    await Match.dislikeUser(from_user, parseInt(user_id));
    res.status(200).json(apiResponse({ status: true, message: 'Disliked', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/matches
exports.getMatches = async (req, res) => {
  try {
    const user_id = req.user.id;
    const matches = await Match.getMatches(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Matches fetched', data: matches }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/matches/unmatch
exports.unmatch = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { match_id } = req.body;
    if (!match_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'match_id required', data: [] }));
    }
    const match = await Match.getMatchById(match_id);
    if (!match || (match.user1_id !== user_id && match.user2_id !== user_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }
    await Match.unmatch(match.user1_id, match.user2_id);
    res.status(200).json(apiResponse({ status: true, message: 'Unmatched', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/matches/block
exports.block = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { match_id } = req.body;
    if (!match_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'match_id required', data: [] }));
    }
    const match = await Match.getMatchById(match_id);
    if (!match || (match.user1_id !== user_id && match.user2_id !== user_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }
    await Match.block(match.user1_id, match.user2_id);
    res.status(200).json(apiResponse({ status: true, message: 'Blocked', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
