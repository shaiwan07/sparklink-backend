const appleSignin = require('apple-signin-auth');

/**
 * Verify an Apple identity token from Flutter's sign_in_with_apple SDK.
 * Returns { apple_id, email, name } on success, throws on failure.
 *
 * Note: Apple only sends email + name on the FIRST login for a user.
 * On subsequent logins the JWT contains only the apple_id (sub).
 * Always store the email the first time and reuse it thereafter.
 */
async function verifyAppleToken(identityToken) {
  const payload = await appleSignin.verifyIdToken(identityToken, {
    audience: process.env.APPLE_CLIENT_ID,
    ignoreExpiration: false,
  });

  return {
    apple_id: payload.sub,
    email:    payload.email   || null,
    name:     payload.name    || null,
  };
}

module.exports = { verifyAppleToken };
