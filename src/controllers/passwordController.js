const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendMail } = require('../helpers/emailHelper');
const MSG = require('../constants/error');
const { generateOTP } = require('../helpers/common');
const EmailOTP = require('../models/EmailOTP');
const forgotPasswordTemplate = require('../helpers/forgotPasswordTemplate');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// POST /auth/forgot-password
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
    await EmailOTP.createOTP(email, otp, 'reset');
    await sendMail({
      to: email,
      subject: 'Sparklink — Password Reset Code',
      html: forgotPasswordTemplate(otp)
    });
    return res.status(200).json(apiResponse({ status: true, message: 'Password reset OTP sent to your email', data: [] }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /auth/reset-password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json(apiResponse({ status: false, message: 'Email, OTP and new password are required', data: [] }));
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: MSG.USER_NOT_FOUND, data: [] }));
    }
    const dbOtp = await EmailOTP.getOTP(email);
    if (!dbOtp || dbOtp !== otp) {
      return res.status(401).json(apiResponse({ status: false, message: 'Invalid or expired OTP', data: [] }));
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.user_id, hash);
    await EmailOTP.markUsed(email);
    return res.status(200).json(apiResponse({ status: true, message: 'Password reset successful', data: [] }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
