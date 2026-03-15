/**
 * Generate a simple, branded HTML email for OTP
 * @param {string} otp - The 6-digit OTP code
 * @returns {string} HTML string
 */
function otpTemplate(otp) {
  return `
  <div style="background:#1a093e;padding:32px 0;text-align:center;font-family:sans-serif;min-height:100vh;">
    <div style="background:#fff;border-radius:12px;max-width:400px;margin:0 auto;padding:32px 24px;box-shadow:0 2px 16px #0002;">
      <img src='https://i.imgur.com/0y0y0y0.png' alt='Sparklink Logo' style='width:64px;margin-bottom:16px;'>
      <h2 style="color:#7c3aed;margin-bottom:8px;">Verify your email</h2>
      <p style="color:#333;font-size:16px;margin-bottom:24px;">Your Sparklink verification code is:</p>
      <div style="font-size:32px;letter-spacing:12px;font-weight:bold;color:#7c3aed;margin-bottom:24px;">${otp}</div>
      <p style="color:#666;font-size:14px;">Enter this code in the app to verify your email address.<br>Code is valid for 10 minutes.</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
      <div style="color:#aaa;font-size:12px;">If you did not request this, you can ignore this email.</div>
    </div>
  </div>
  `;
}

module.exports = otpTemplate;
