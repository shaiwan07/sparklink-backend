const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Step 1 — send OTP to email
router.post('/forgot-password', passwordController.forgotPassword);

// Step 2 — verify OTP, receive short-lived reset_token
router.post('/verify-reset-otp', passwordController.verifyResetOtp);

// Step 3 — set new password using reset_token
router.post('/reset-password', passwordController.resetPassword);

module.exports = router;
