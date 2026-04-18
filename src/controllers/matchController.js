const Match = require('../models/Match');
const User = require('../models/User');
const Notification = require('../models/Notification');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

/**
 * Send a like/superlike notification to the target user.
 * Uses the sender's name so the message reads: "Amelia liked your profile."
 */
async function notifyLike(from_user_id, to_user_id, type = 'liked') {
  try {
    const sender = await User.findById(from_user_id);
    const senderName = sender?.full_name || 'Someone';

    const message = type === 'superliked'
      ? `${senderName} sent you a Superlike!`
      : `${senderName} liked your profile.`;

    // reference_id = from_user_id so the app can open that person's profile
    await Notification.create(to_user_id, type, message, {}, from_user_id);
  } catch (_) {
    // Never let notification errors crash the like/superlike response
  }
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
    notifyMatch(from_user, to_user);
    return false;
    if (!user_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'user_id required', data: [] }));
    }

    const to_user = parseInt(user_id);
    const result = await Match.likeUser(from_user, to_user);

    if (result.result === 'matched') {
      // Mutual match — notify both, skip the plain "liked" notification
      notifyMatch(from_user, to_user);
    } else {
      // One-sided like — notify the target
      notifyLike(from_user, to_user, 'liked');
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

    const to_user = parseInt(user_id);
    const result = await Match.superlikeUser(from_user, to_user);

    if (result.result === 'matched') {
      notifyMatch(from_user, to_user);
    } else {
      notifyLike(from_user, to_user, 'superliked');
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
