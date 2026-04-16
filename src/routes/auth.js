const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const socialAuthController = require('../controllers/socialAuthController');

// Email / password auth
router.post('/register',     authController.register);
router.post('/login',        authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-otp',   authController.resendOtp);

// Social auth
router.post('/facebook', socialAuthController.facebookLogin);
router.post('/google',   socialAuthController.googleLogin);

module.exports = router;
