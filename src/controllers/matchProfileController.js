const Match = require('../models/Match');
const User = require('../models/User');
const UserPhoto = require('../models/UserPhoto');
const Interest = require('../models/Interest');
const Location = require('../models/Location');
const Preference = require('../models/Preference');
const { Questionnaire } = require('../models/Questionnaire');
const UserInterest = require('../models/Interest');
const { calculateMatchPercentage } = require('../helpers/matchHelper');
const { GapReport, MatchReasons } = require('../models/GapReport');
const VideoCall = require('../models/VideoCall');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// GET /api/matches/:matchId/profile
// Full profile of the matched user with compatibility analysis
exports.getMatchProfile = async (req, res) => {
  try {
    const my_id = req.user.id;
    const { matchId } = req.params;

    const match = await Match.getMatchById(matchId);
    if (!match || (match.user1_id !== my_id && match.user2_id !== my_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }

    const other_id = match.user1_id === my_id ? match.user2_id : match.user1_id;
    const matchedUser = await User.findById(other_id);
    if (!matchedUser) {
      return res.status(404).json(apiResponse({ status: false, message: 'Matched user not found', data: [] }));
    }

    const [photos, interests, location, gapReport, matchReasons, match_percentage] = await Promise.all([
      UserPhoto.getAll(other_id),
      Interest.getUserInterests(other_id),
      Location.get(other_id),
      GapReport.get(matchId),
      MatchReasons.get(matchId),
      calculateMatchPercentage(my_id, other_id, UserInterest, Preference, Questionnaire)
    ]);

    const { password_hash, phone, instagram_username, ...safeUser } = matchedUser;

    res.status(200).json(apiResponse({
      status: true,
      message: 'Match profile fetched',
      data: [{
        match_id: match.match_id,
        user: safeUser,
        photos,
        interests,
        location,
        match_percentage,
        gap_report: gapReport,
        match_reasons: matchReasons
      }]
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/matches/:matchId/contact
// Returns phone + instagram of matched user (shown on "It's a Match!" screen 55)
exports.getMatchContact = async (req, res) => {
  try {
    const my_id = req.user.id;
    const { matchId } = req.params;

    const match = await Match.getMatchById(matchId);
    if (!match || (match.user1_id !== my_id && match.user2_id !== my_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }

    const other_id = match.user1_id === my_id ? match.user2_id : match.user1_id;
    const matchedUser = await User.findById(other_id);
    if (!matchedUser) {
      return res.status(404).json(apiResponse({ status: false, message: 'User not found', data: [] }));
    }

    res.status(200).json(apiResponse({
      status: true,
      message: 'Contact info fetched',
      data: [{
        phone: matchedUser.phone || null,
        instagram_username: matchedUser.instagram_username || null
      }]
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/video-calls/:callId/feedback
// Post-call action: love_it | not_a_match (screen 56)
exports.postCallFeedback = async (req, res) => {
  try {
    const my_id = req.user.id;
    const { callId } = req.params;
    const { feedback } = req.body; // 'love_it' | 'not_a_match'

    if (!feedback || !['love_it', 'not_a_match'].includes(feedback)) {
      return res.status(400).json(apiResponse({
        status: false,
        message: "feedback must be 'love_it' or 'not_a_match'",
        data: []
      }));
    }

    const call = await VideoCall.getByCallId(callId);
    if (!call) {
      return res.status(404).json(apiResponse({ status: false, message: 'Call not found', data: [] }));
    }

    const match = await Match.getMatchById(call.match_id);
    if (!match || (match.user1_id !== my_id && match.user2_id !== my_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }

    // Mark call as completed
    await VideoCall.updateStatus(callId, 'completed');

    // If "not a match", unmatch the users
    if (feedback === 'not_a_match') {
      await Match.unmatch(match.user1_id, match.user2_id);
    }

    res.status(200).json(apiResponse({
      status: true,
      message: feedback === 'love_it' ? 'Great! Enjoy your connection.' : 'Match removed.',
      data: []
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
