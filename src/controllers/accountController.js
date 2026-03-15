const Account = require('../models/Account');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

exports.deleteAccount = async (req, res) => {
  try {
    const user_id = req.user.id;
    await Account.deleteAccount(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Account deleted', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const settings = req.body;
    if (!settings || Object.keys(settings).length === 0) {
      return res.status(400).json(apiResponse({ status: false, message: 'No settings provided', data: [] }));
    }
    await Account.updateSettings(user_id, settings);
    res.status(200).json(apiResponse({ status: true, message: 'Settings updated', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
