const { Report } = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const { reportedUserId, reporterUserId, reason, details } = req.body;
    const report = await Report.create({ reportedUserId, reporterUserId, reason, details });
    res.json({ status: true, message: 'Report submitted', data: report });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Failed to submit report', error: err.message });
  }
};
