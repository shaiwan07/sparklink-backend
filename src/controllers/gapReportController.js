const { GapReport, MatchReasons } = require('../models/GapReport');

exports.getGapReport = async (req, res) => {
  const { matchId } = req.params;
  const report = await GapReport.get(matchId);
  res.json({ status: true, message: 'Gap report fetched', data: report });
};

exports.getMatchReasons = async (req, res) => {
  const { matchId } = req.params;
  const reasons = await MatchReasons.get(matchId);
  res.json({ status: true, message: 'Match reasons fetched', data: reasons });
};
