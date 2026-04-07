function forgotPasswordTemplate(otp) {
  return `
  <div style="margin:0;padding:0;background:#14052c;font-family:Arial, sans-serif;">
    <div style="background: radial-gradient(circle at top, #2b0a5a, #14052c); padding:40px 0; text-align:center;">
      <div style="background:#ffffff;border-radius:20px;max-width:420px;margin:0 auto;padding:30px 25px;box-shadow:0 10px 30px rgba(0,0,0,0.4);">
        <div style="margin-bottom:20px;">
          <div style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ff4fd8);display:inline-flex;align-items:center;justify-content:center;font-size:28px;color:white;font-weight:bold;">
            🔒
          </div>
        </div>
        <h1 style="margin:0;color:#7c3aed;font-size:24px;font-weight:700;">
          SparkLink
        </h1>
        <p style="color:#666;font-size:13px;margin-top:4px;">
          Smart Links, Real Connections
        </p>
        <h2 style="color:#333;margin-top:25px;font-size:20px;">
          Reset your password
        </h2>
        <p style="color:#555;font-size:15px;margin-bottom:20px;">
          Use this code to reset your password:
        </p>
        <div style="
          font-size:34px;
          letter-spacing:12px;
          font-weight:bold;
          color:#7c3aed;
          background:#f5f3ff;
          padding:15px;
          border-radius:10px;
          display:inline-block;
          margin-bottom:20px;">
          ${otp}
        </div>
        <p style="color:#666;font-size:14px;line-height:1.5;">
          Enter this code in the app to reset your password.<br/>
          <strong>Code is valid for 10 minutes.</strong>
        </p>
        <hr style="margin:25px 0;border:none;border-top:1px solid #eee;">
        <p style="color:#aaa;font-size:12px;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
      <p style="color:#bbb;font-size:12px;margin-top:20px;">
        © ${new Date().getFullYear()} SparkLink
      </p>
    </div>
  </div>
  `;
}

module.exports = forgotPasswordTemplate;
