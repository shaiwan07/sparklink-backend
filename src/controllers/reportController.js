const { Report } = require('../models/Report');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// POST /api/report
exports.createReport = async (req, res) => {
  try {
    const reporter_id = req.user.id;
    const { reported_id, reason } = req.body;

    if (!reported_id || !reason) {
      return res.status(400).json(apiResponse({ status: false, message: 'reported_id and reason are required', data: [] }));
    }

    await Report.create({ reporter_id, reported_id, reason });
    res.status(201).json(apiResponse({ status: true, message: 'Report submitted successfully', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
