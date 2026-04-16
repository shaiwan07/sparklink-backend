const axios = require('axios');

/**
 * Verify a Facebook access token and return the user's profile.
 * Calls the Facebook Graph API directly — no SDK needed.
 *
 * @param {string} accessToken - Token sent by the Flutter app after FB login
 * @returns {{ fb_id, name, email, picture }} — throws on any error
 */
async function verifyFacebookToken(accessToken) {
  if (!accessToken) throw new Error('Facebook access token is required');

  let data;
  try {
    const response = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture.type(large)',
        access_token: accessToken,
      },
      timeout: 8000,
    });
    data = response.data;
  } catch (err) {
    // Facebook returns 4xx for invalid/expired tokens
    const fbMsg = err.response?.data?.error?.message || err.message;
    throw new Error(`Facebook token verification failed: ${fbMsg}`);
  }

  if (!data.id) throw new Error('Facebook did not return a user ID');

  return {
    fb_id:   data.id,
    name:    data.name   || null,
    email:   data.email  || null,          // FB may omit email (deauthorised app)
    picture: data.picture?.data?.url || null,
  };
}

module.exports = { verifyFacebookToken };
