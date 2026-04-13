const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MSG = require('../constants/error');
const { sendMail } = require('../helpers/emailHelper');
const otpTemplate = require('../helpers/otpTemplate');
const { generateOTP } = require('../helpers/common');
const EmailOTP = require('../models/EmailOTP');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /auth/register
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
    await User.create({ email, password_hash: hash });

    const otp = generateOTP();
    await EmailOTP.createOTP(email, otp, 'signup');
    await sendMail({
      to: email,
      subject: 'Sparklink — Verify Your Email',
      html: otpTemplate(otp)
    });

    return res.status(201).json(apiResponse({ status: true, message: MSG.USER_REGISTERED, data: [] }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /auth/login
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
      return res.status(403).json(apiResponse({ status: false, message: 'Email not verified. Please verify your email before logging in.', data: [] }));
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json(apiResponse({ status: false, message: MSG.INVALID_CREDENTIALS, data: [] }));
    }
    const token = generateToken(user);
    const { password_hash, ...userData } = user;
    return res.status(200).json(apiResponse({
      status: true,
      message: MSG.LOGIN_SUCCESSFUL,
      data: [{ token, user: userData }]
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /auth/verify-email
exports.verifyEmail = async (req, res) => {
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
    if (!dbOtp || dbOtp !== otp) {
      return res.status(401).json(apiResponse({ status: false, message: 'Invalid or expired OTP', data: [] }));
    }
    await User.verify(user.user_id);
    await EmailOTP.markUsed(email);

    const token = generateToken(user);
    const { password_hash, ...userData } = user;
    return res.status(200).json(apiResponse({
      status: true,
      message: 'Email verified successfully',
      data: [{ token, user: userData }]
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /auth/resend-otp
exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(apiResponse({ status: false, message: 'Email is required', data: [] }));
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: MSG.USER_NOT_FOUND, data: [] }));
    }
    if (user.is_verified) {
      return res.status(400).json(apiResponse({ status: false, message: 'Email is already verified', data: [] }));
    }
    const otp = generateOTP();
    await EmailOTP.createOTP(email, otp, 'signup');
    await sendMail({
      to: email,
      subject: 'Sparklink — New Verification Code',
      html: otpTemplate(otp)
    });
    return res.status(200).json(apiResponse({ status: true, message: 'OTP resent successfully', data: [] }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
