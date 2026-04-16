const { OAuth2Client } = require('google-auth-library');

// One client instance — reused across requests
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify a Google ID token (sent by the Flutter app after Google Sign-In).
 *
 * @param {string} idToken - ID token from Google Sign-In SDK
 * @returns {{ google_id, name, email, picture }} — throws on any error
 */
async function verifyGoogleToken(idToken) {
  if (!idToken) throw new Error('Google ID token is required');

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    throw new Error(`Google token verification failed: ${err.message}`);
  }

  const payload = ticket.getPayload();
  if (!payload) throw new Error('Google token payload is empty');

  return {
    google_id: payload.sub,
    name:      payload.name    || null,
    email:     payload.email   || null,
    picture:   payload.picture || null,
  };
}

module.exports = { verifyGoogleToken };
