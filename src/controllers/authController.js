// This file has been moved to src/controllers
// Original location: c:\sparklink-dating\controllers\authController.js
// New location: c:\sparklink-dating\src\controllers\authController.js
// Auth controller for Sparklink Dating
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



const MSG = require('../constants/error');
const { sendMail } = require('../helpers/emailHelper');
const otpTemplate = require('../helpers/otpTemplate');
const { generateOTP } = require('../helpers/common');
const EmailOTP = require('../models/EmailOTP');

// If not present, add this to your User model:
// async verify(userId) { await pool.query('UPDATE Users SET is_verified=1 WHERE id=?', [userId]); }

// Helper for consistent API response
function apiResponse({ status, message, data }) {
  return { status, message, data };
}

exports.register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    return res.status(400).json(apiResponse({ status: false, message: MSG.EMAIL_PASSWORD_REQUIRED, data: [] }));
  }
  if (password !== confirmPassword) {
    return res.status(400).json(apiResponse({ status: false, message: 'Passwords do not match', data: [] }));
  }
  try {
    const exists = await User.existsByEmail(email);
    if (exists) {
      return res.status(409).json(apiResponse({ status: false, message: MSG.EMAIL_ALREADY_REGISTERED, data: [] }));
    }
    const hash = await bcrypt.hash(password, 10);
    const userId = await User.create({ email, password_hash: hash });
    // Generate OTP
    const otp = generateOTP();
    await EmailOTP.createOTP(userId, otp);
    // Send OTP email using helper and template
    await sendMail({
      to: email,
      subject: 'Sparklink Email Verification',
      html: otpTemplate(otp)
    });
    return res.status(201).json(apiResponse({ status: true, message: MSG.USER_REGISTERED, data: [] }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(apiResponse({ status: false, message: MSG.EMAIL_PASSWORD_REQUIRED, data: [] }));
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json(apiResponse({ status: false, message: MSG.INVALID_CREDENTIALS, data: [] }));
    }
    if (!user.is_verified) {
      return res.status(403).json(apiResponse({ status: false, message: 'Email not verified. Please verify your email before login.', data: [] }));
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json(apiResponse({ status: false, message: MSG.INVALID_CREDENTIALS, data: [] }));
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Remove sensitive fields before sending user data
    const { password_hash, ...userData } = user;
    return res.status(200).json(apiResponse({
      status: true,
      message: MSG.LOGIN_SUCCESSFUL,
      data: [{ token, user: userData }]
    }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json(apiResponse({ status: false, message: 'Email and OTP required', data: [] }));
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: 'User not found', data: [] }));
    }
    const dbOtp = await EmailOTP.getOTP(user.id);
    if (dbOtp !== otp) {
      return res.status(401).json(apiResponse({ status: false, message: 'Invalid OTP', data: [] }));
    }
    // Mark user as verified
    if (typeof User.verify === 'function') {
      await User.verify(user.id);
    }
    await EmailOTP.deleteOTP(user.id);
    return res.status(200).json(apiResponse({ status: true, message: 'Email verified', data: [] }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
