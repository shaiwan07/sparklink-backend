const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMail } = require('../helpers/emailHelper');
const MSG = require('../constants/error');
const { generateOTP } = require('../helpers/common');
const EmailOTP = require('../models/EmailOTP');
const forgotPasswordTemplate = require('../helpers/forgotPasswordTemplate');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
// POST /auth/forgot-password
// Body: { email }
// → generates OTP, sends it to the user's email
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
    return res.status(200).json(apiResponse({ status: true, message: 'OTP sent to your email', data: [] }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// ─── Step 2 ───────────────────────────────────────────────────────────────────
// POST /auth/verify-reset-otp
// Body: { email, otp }
// → validates OTP, marks it used, returns a short-lived reset_token (15 min)
exports.verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json(apiResponse({ status: false, message: 'Email and OTP are required', data: [] }));
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: MSG.USER_NOT_FOUND, data: [] }));
    }
    const dbOtp = await EmailOTP.getOTP(email);
    if (!dbOtp || String(dbOtp) !== String(otp)) {
      return res.status(401).json(apiResponse({ status: false, message: 'Invalid or expired OTP', data: [] }));
    }

    // Consume OTP so it cannot be reused
    await EmailOTP.markUsed(email);

    // Issue a short-lived reset token (15 min) — the app passes this to step 3
    const reset_token = jwt.sign(
      { user_id: user.user_id, email: user.email, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json(apiResponse({
      status: true,
      message: 'OTP verified successfully',
      data: [{ reset_token }]
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// ─── Step 3 ───────────────────────────────────────────────────────────────────
// POST /auth/reset-password
// Body: { reset_token, newPassword, confirmPassword }
// → verifies the reset token from step 2, sets new password
exports.resetPassword = async (req, res) => {
  const { reset_token, newPassword, confirmPassword } = req.body;
  if (!reset_token || !newPassword || !confirmPassword) {
    return res.status(400).json(apiResponse({
      status: false,
      message: 'reset_token, newPassword and confirmPassword are required',
      data: []
    }));
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json(apiResponse({ status: false, message: 'Passwords do not match', data: [] }));
  }
  try {
    let payload;
    try {
      payload = jwt.verify(reset_token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json(apiResponse({ status: false, message: 'Reset token is invalid or has expired', data: [] }));
    }

    if (payload.purpose !== 'password_reset') {
      return res.status(401).json(apiResponse({ status: false, message: 'Invalid reset token', data: [] }));
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(payload.user_id, hash);

    return res.status(200).json(apiResponse({ status: true, message: 'Password reset successful', data: [] }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
