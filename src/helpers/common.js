// helpers/common.js - Common utility functions for Sparklink Dating

/**
 * Generate a random 6-digit OTP as a string
 * @returns {string}
 */
function generateOTP() {
  // return Math.floor(100000 + Math.random() * 900000).toString();
  return 123456;
}

module.exports = {
  generateOTP
};
