const Match = require('../models/Match');
const User = require('../models/User');
const Notification = require('../models/Notification');
const MSG = require('../constants/error');
const { sendSMS, SMS } = require('../helpers/smsHelper');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

/**
 * Send a like notification to the target user.
 */
async function notifyLike(from_user_id, to_user_id) {
  try {
    const [sender, recipient] = await Promise.all([
      User.findById(from_user_id),
      User.findById(to_user_id),
    ]);
    const senderName = sender?.full_name || 'Someone';
    const message = `${senderName} liked your profile.`;

    await Notification.create(to_user_id, 'liked', message, {}, from_user_id);
    sendSMS(recipient?.phone, SMS.liked(senderName)).catch(() => {});
  } catch (_) {}
}

/**
 * Notify both users when a mutual match is created.
 * reference_id = the other user's id so each side can open their match's profile.
 */
async function notifyMatch(user1_id, user2_id) {
  try {
    await Promise.all([
      Notification.create(
        user1_id, 'new_match',
        "It's a Match! You both liked each other.",
        {}, user2_id
      ),
      Notification.create(
        user2_id, 'new_match',
        "It's a Match! You both liked each other.",
        {}, user1_id
      ),
    ]);
  } catch (_) {}
}

// POST /api/matches/like
exports.likeUser = async (req, res) => {
  try {
    const from_user = req.user.id;
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user_id required', data: [] }));
    }

    const to_user = parseInt(user_id);

    // Spark Mode guard — neither party can like/be liked while in an active match
    const [callerLocked, targetLocked] = await Promise.all([
      Match.isInSparkMode(from_user),
      Match.isInSparkMode(to_user),
    ]);
    if (callerLocked) {
      return res.status(403).json(apiResponse({ status: false, message: 'You are in Spark Mode with your current match. Finish that connection first.', data: [] }));
    }
    if (targetLocked) {
      return res.status(403).json(apiResponse({ status: false, message: 'This user is currently in Spark Mode with another match.', data: [] }));
    }

    const result = await Match.likeUser(from_user, to_user);

    if (result.result === 'matched') {
      notifyMatch(from_user, to_user);
    } else {
      notifyLike(from_user, to_user);
    }

    const message = result.result === 'matched' ? "It's a Match!" : 'Like sent';
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
