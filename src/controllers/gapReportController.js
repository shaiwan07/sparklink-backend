const { GapReport, MatchReasons } = require('../models/GapReport');
const Match = require('../models/Match');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// GET /api/gap-report/:matchId
exports.getGapReport = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { matchId } = req.params;

    const match = await Match.getMatchById(matchId);
    if (!match || (match.user1_id !== user_id && match.user2_id !== user_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }

    const report = await GapReport.get(matchId);
    res.status(200).json(apiResponse({ status: true, message: 'Gap report fetched', data: report }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/gap-report/:matchId/reasons
exports.getMatchReasons = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { matchId } = req.params;

    const match = await Match.getMatchById(matchId);
    if (!match || (match.user1_id !== user_id && match.user2_id !== user_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }

    const reasons = await MatchReasons.get(matchId);
    res.status(200).json(apiResponse({ status: true, message: 'Match reasons fetched', data: reasons }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
