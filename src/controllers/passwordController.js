// This file has been moved to src/controllers
// Original location: c:\sparklink-dating\controllers\passwordController.js
// New location: c:\sparklink-dating\src\controllers\passwordController.js
// Controller for password reset and forgot password
const User = require('../models/User');
const { sendMail } = require('../helpers/emailHelper');
const MSG = require('../constants/error');
const { generateOTP } = require('../helpers/common');
const EmailOTP = require('../models/EmailOTP');
const bcrypt = require('bcrypt');
const forgotPasswordTemplate = require('../helpers/forgotPasswordTemplate');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(apiResponse({ status: false, message: MSG.EMAIL_REQUIRED, data: [] }));
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: MSG.USER_NOT_FOUND, data: [] }));
    }
    const otp = generateOTP();
    await EmailOTP.createOTP(user.id, otp);
    await sendMail({
      to: email,
      subject: 'Sparklink Password Reset',
      html: forgotPasswordTemplate(otp)
    });
    return res.status(200).json(apiResponse({ status: true, message: 'OTP sent to email', data: [] }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json(apiResponse({ status: false, message: 'Email, OTP, and new password required', data: [] }));
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: MSG.USER_NOT_FOUND, data: [] }));
    }
    const dbOtp = await EmailOTP.getOTP(user.id);
    if (dbOtp !== otp) {
      return res.status(401).json(apiResponse({ status: false, message: 'Invalid OTP', data: [] }));
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hash);
    await EmailOTP.deleteOTP(user.id);
    return res.status(200).json(apiResponse({ status: true, message: 'Password reset successful', data: [] }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
