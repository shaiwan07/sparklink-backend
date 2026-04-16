const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyFacebookToken } = require('../services/facebookAuthService');
const { verifyGoogleToken } = require('../services/googleAuthService');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Find an existing user or create a new one for a social login.
 * Lookup order: provider ID → email → create new account.
 */
async function findOrCreateSocialUser({ providerKey, providerId, email, full_name, picture }) {
  // 1. Try to find by provider-specific ID
  let user = providerKey === 'facebook_id'
    ? await User.findByFacebookId(providerId)
    : await User.findByGoogleId(providerId);

  if (user) return user;

  // 2. Try to find by email (account already exists via email/password or other provider)
  if (email) {
    user = await User.findByEmail(email);
    if (user) {
      // Link this provider to the existing account so future logins are faster
      await User.linkSocialId(user.user_id, { [providerKey]: providerId });
      return await User.findById(user.user_id); // re-fetch with updated column
    }
  }

  // 3. Create a brand-new user
  const newId = await User.createSocialUser({
    email,
    full_name,
    profile_photo_url: picture,
    facebook_id: providerKey === 'facebook_id' ? providerId : null,
    google_id:   providerKey === 'google_id'   ? providerId : null,
  });

  return await User.findById(newId);
}

// ─────────────────────────────────────────────────────────────
// POST /auth/facebook
// Body: { access_token: "<FB short-lived or long-lived token>" }
// ─────────────────────────────────────────────────────────────
exports.facebookLogin = async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json(apiResponse({
      status: false,
      message: 'access_token is required',
      data: []
    }));
  }

  try {
    // 1. Verify token with Facebook Graph API
    const { fb_id, name, email, picture } = await verifyFacebookToken(access_token);

    // 2. Find or create user
    const user = await findOrCreateSocialUser({
      providerKey: 'facebook_id',
      providerId:  fb_id,
      email,
      full_name:   name,
      picture,
    });

    // 3. Issue JWT
    const token = generateToken(user);
    const { password_hash, ...userData } = user;

    return res.status(200).json(apiResponse({
      status:  true,
      message: 'Facebook login successful',
      data:    [{ token, user: userData }],
    }));

  } catch (err) {
    console.error('[Facebook Login]', err.message);

    // Distinguish token errors (4xx) from server errors (5xx)
    const isBadToken = err.message.includes('verification failed') ||
                       err.message.includes('required');

    return res.status(isBadToken ? 401 : 500).json(apiResponse({
      status:  false,
      message: isBadToken ? err.message : MSG.SERVER_ERROR,
      data:    [],
    }));
  }
};

// ─────────────────────────────────────────────────────────────
// POST /auth/google
// Body: { id_token: "<Google ID token from Sign-In SDK>" }
// ─────────────────────────────────────────────────────────────
exports.googleLogin = async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json(apiResponse({
      status: false,
      message: 'id_token is required',
      data: []
    }));
  }

  try {
    // 1. Verify token with Google
    const { google_id, name, email, picture } = await verifyGoogleToken(id_token);

    // 2. Find or create user
    const user = await findOrCreateSocialUser({
      providerKey: 'google_id',
      providerId:  google_id,
      email,
      full_name:   name,
      picture,
    });

    // 3. Issue JWT
    const token = generateToken(user);
    const { password_hash, ...userData } = user;

    return res.status(200).json(apiResponse({
      status:  true,
      message: 'Google login successful',
      data:    [{ token, user: userData }],
    }));

  } catch (err) {
    console.error('[Google Login]', err.message);

    const isBadToken = err.message.includes('verification failed') ||
                       err.message.includes('required');

    return res.status(isBadToken ? 401 : 500).json(apiResponse({
      status:  false,
      message: isBadToken ? err.message : MSG.SERVER_ERROR,
      data:    [],
    }));
  }
};
