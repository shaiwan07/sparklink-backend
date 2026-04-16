const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const TOKEN_EXPIRY_SECONDS = 3600; // 1 hour

/**
 * Generate a unique Agora channel name for a match.
 * Both users calling with the same match_id get the same channel — ensuring
 * they land in the same call room.
 *
 * @param {number} matchId
 * @returns {string}  e.g. "call_100_1713456789123"
 */
function buildChannelName(matchId) {
  return `call_${matchId}_${Date.now()}`;
}

/**
 * Generate an Agora RTC token.
 *
 * @param {string} channelName  - From buildChannelName()
 * @param {number} uid          - User's user_id (integer ≥ 0; 0 = wildcard)
 * @returns {string}            - Signed RTC token valid for 1 hour
 */
function generateRtcToken(channelName, uid = 0) {
  const appId          = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    throw new Error('AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in .env');
  }

  const expireTs = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    RtcRole.PUBLISHER,
    expireTs
  );

  return token;
}

module.exports = { buildChannelName, generateRtcToken, TOKEN_EXPIRY_SECONDS };
