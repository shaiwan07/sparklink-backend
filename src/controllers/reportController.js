const { Report } = require('../models/Report');
const User = require('../models/User');
const Notification = require('../models/Notification');
const MSG = require('../constants/error');
const { sendSMS, SMS } = require('../helpers/smsHelper');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// POST /api/report
// Body: { reported_id, reason, video_call_id? }
// When submitted:
//   1. Saves the report with video_call_id and status = 'pending'
//   2. Auto-suspends the reported user for 24 hours
//   3. Sends the reported user a notification explaining the suspension
exports.createReport = async (req, res) => {
  try {
    const reporter_id = req.user.id;
    const { reported_id, reason, video_call_id } = req.body;

    if (!reported_id || !reason) {
      return res.status(400).json(apiResponse({
        status: false,
        message: 'reported_id and reason are required',
        data: []
      }));
    }

    if (reporter_id === parseInt(reported_id)) {
      return res.status(400).json(apiResponse({
        status: false,
        message: 'You cannot report yourself',
        data: []
      }));
    }

    // Save the report
    await Report.create({ reporter_id, reported_id: parseInt(reported_id), reason, video_call_id: video_call_id || null });

    // Auto-suspend the reported user for 24 hours
    const suspendedUntil = await User.suspend(parseInt(reported_id), 24);

    // Notify the reported user about the suspension
    const until = new Date(suspendedUntil).toUTCString();
    Notification.create(
      parseInt(reported_id),
      'suspension',
      `Your account has been temporarily suspended for 24 hours (until ${until}) due to a report filed against you. Our team will review the case.`,
      {},
      null
    ).catch(() => {});

    const reportedUser = await User.findById(parseInt(reported_id));
    sendSMS(reportedUser?.phone, SMS.suspension()).catch(() => {});

    res.status(201).json(apiResponse({
      status: true,
      message: 'Report submitted. The user has been suspended for 24 hours pending review.',
      data: []
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
