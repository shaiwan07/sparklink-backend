/*
 * ═══════════════════════════════════════════════════════════════
 * TWILIO SMS HELPER
 *
 * Controlled by TWILIO_ENABLED in .env:
 *   TWILIO_ENABLED=true   → SMS messages are sent
 *   TWILIO_ENABLED=false  → sendSMS() is a no-op (safe for dev/staging)
 *
 * Also requires in .env:
 *   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_AUTH_TOKEN=your_auth_token
 *   TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
 * ═══════════════════════════════════════════════════════════════
 */

const twilio = require('twilio');

let client = null;
const FROM = process.env.TWILIO_PHONE_NUMBER;

function getClient() {
  if (!client && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return client;
}

/**
 * Send a plain SMS to a phone number.
 * No-ops if TWILIO_ENABLED != 'true', if phone is null, or if credentials are missing.
 *
 * @param {string|null} to    - E.164 format e.g. "+972501234567"
 * @param {string}      body  - SMS text (keep under 160 chars for 1 segment)
 */
async function sendSMS(to, body) {
  if (process.env.TWILIO_ENABLED !== 'true') return;
  if (!to) return;
  const c = getClient();
  if (!c) return;
  try {
    await c.messages.create({ from: FROM, to, body });
  } catch (err) {
    console.error('[SMS] Failed to send to', to, '—', err.message);
  }
}

// SMS message templates — keep all messages short (< 160 chars)
const SMS = {
  liked: (senderName) =>
    `${senderName} liked your profile on Sparklink! Open the app to see who it is.`,

  superliked: (senderName) =>
    `${senderName} sent you a Superlike on Sparklink! Open the app to check it out.`,

  matched: (matchName) =>
    `It's a Match! You and ${matchName} liked each other on Sparklink. Schedule your video date now!`,

  unmatched: (matchName) =>
    `${matchName} has ended your match on Sparklink.`,

  callScheduled: (matchName, timeStr) =>
    `Your video date with ${matchName} on Sparklink is scheduled for ${timeStr}. Don't be late!`,

  callCancelled: (matchName) =>
    `Your video date with ${matchName} on Sparklink has been cancelled. Open the app to reschedule.`,

  scheduleReminder: (matchName, hoursLeft) =>
    `Reminder: You have ${hoursLeft}h left to schedule your video date with ${matchName} on Sparklink.`,

  suspension: () =>
    `Your Sparklink account has been suspended for 24 hours due to a report. Our team will review your case.`,
};

module.exports = { sendSMS, SMS };
