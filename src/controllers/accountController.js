const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const User = require('../models/User');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

exports.deleteAccount = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { password } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: 'User not found', data: [] }));
    }

    // Social login users (Google / Facebook / Apple) have no password_hash — skip verification
    const isSocialUser = !user.password_hash || user.password_hash.trim() === '';
    if (!isSocialUser) {
      if (!password) {
        return res.status(400).json(apiResponse({ status: false, message: 'Password is required to delete your account', data: [] }));
      }
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json(apiResponse({ status: false, message: 'Incorrect password', data: [] }));
      }
    }

    await Account.deleteAccount(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Account deleted', data: [] }));
  } catch (err) {
    console.error(err);
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
