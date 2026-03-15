const nodemailer = require('nodemailer');

const smtpSecure = typeof process.env.SMTP_SECURE !== "undefined"
  ? String(process.env.SMTP_SECURE).toLowerCase() === "true"
  : false;
const smtpPort = Number(process.env.SMTP_PORT || (smtpSecure ? 465 : 587));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.SMTP_USER || 'your_email@example.com',
    pass: process.env.SMTP_PASS || 'your_email_password'
  },
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
  socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 10000)
});

/**
 * Send an email using the configured transporter
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @returns {Promise}
 */
async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@sparklink.com',
    to,
    subject,
    html
  });
}

module.exports = { sendMail };
