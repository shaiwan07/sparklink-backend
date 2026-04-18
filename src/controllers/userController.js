const User = require('../models/User');
const UserPhoto = require('../models/UserPhoto');
const Interest = require('../models/Interest');
const Location = require('../models/Location');
const Match = require('../models/Match');
const { getDistanceFromLatLonInKm } = require('../helpers/locationHelper');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// Fields never exposed in a public profile
const HIDDEN_FIELDS = new Set([
  'password_hash', 'phone', 'instagram_username',
  'facebook_id', 'google_id', 'fcm_token', 'email',
]);

// GET /api/users/:userId/profile
// Public profile view — used when a notification is tapped (pre-match)
exports.getUserProfile = async (req, res) => {
  try {
    const my_id    = req.user.id;
    const other_id = parseInt(req.params.userId);

    if (isNaN(other_id)) {
      return res.status(400).json(apiResponse({ status: false, message: 'Invalid userId', data: [] }));
    }
    if (other_id === my_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'Use GET /api/profile for your own profile', data: [] }));
    }

    const user = await User.findById(other_id);
    if (!user || !user.is_verified) {
      return res.status(404).json(apiResponse({ status: false, message: 'User not found', data: [] }));
    }

    // Strip sensitive fields
    const safeUser = Object.fromEntries(
      Object.entries(user).filter(([k]) => !HIDDEN_FIELDS.has(k))
    );

    // Parallel fetch
    const [photos, interests, theirLocation, myLocation] = await Promise.all([
      UserPhoto.getAll(other_id),
      Interest.getUserInterests(other_id),
      Location.get(other_id),
      Location.get(my_id),
    ]);

    // Distance (null if either location is missing)
    let distance_km = null;
    if (myLocation && theirLocation) {
      const d = getDistanceFromLatLonInKm(
        parseFloat(myLocation.latitude),
        parseFloat(myLocation.longitude),
        parseFloat(theirLocation.latitude),
        parseFloat(theirLocation.longitude)
      );
      distance_km = Math.round(d * 10) / 10;
    }

    // Check if already matched — app can use this to decide which screen to show
    const existingMatch = await Match.getMatchBetween(my_id, other_id);

    return res.status(200).json(apiResponse({
      status: true,
      message: 'Profile fetched',
      data: [{
        user: safeUser,
        photos,
        interests,
        city:        theirLocation?.city   || null,
        distance_km,
        match_id:    existingMatch?.match_id || null,  // non-null → already matched
      }]
    }));

  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
