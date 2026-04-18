const User = require('../models/User');
const Preference = require('../models/Preference');
const Location = require('../models/Location');
const UserPhoto = require('../models/UserPhoto');
const UserInterest = require('../models/Interest');
const { Questionnaire } = require('../models/Questionnaire');
const { getDistanceFromLatLonInKm } = require('../helpers/locationHelper');
const { calculateMatchPercentage } = require('../helpers/matchHelper');

// Fields never exposed in potential matches list
const HIDDEN = new Set([
  'password_hash', 'phone', 'instagram_username',
  'facebook_id', 'google_id', 'fcm_token', 'email',
]);

/**
 * Compute the interaction_status between the current user and a candidate.
 *
 * Possible values (used by Flutter to render the correct UI):
 *   null           — no interaction yet
 *   'i_liked'      — I already liked them (heart turns solid, can still dislike)
 *   'i_superliked' — I already superliked them
 *   'i_disliked'   — I already disliked them
 *   'they_liked'   — They liked me, I haven't responded yet (show indicator)
 *   'matched'      — Mutual match confirmed
 */
function computeInteractionStatus(candidateId, mySwipes, theirSwipes, matchedIds) {
  if (matchedIds.has(candidateId))              return 'matched';
  if (mySwipes[candidateId] === 'like')         return 'i_liked';
  if (mySwipes[candidateId] === 'superlike')    return 'i_superliked';
  if (mySwipes[candidateId] === 'dislike')      return 'i_disliked';
  if (theirSwipes[candidateId] === 'like' ||
      theirSwipes[candidateId] === 'superlike') return 'they_liked';
  return null;
}

// GET /api/matches/potential
exports.getPotentialMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const [preferences, userLocation] = await Promise.all([
      Preference.get(userId),
      Location.get(userId),
    ]);

    if (!preferences || !userLocation) {
      return res.status(400).json({
        status: false,
        message: 'Complete your profile, preferences and location first',
        data: []
      });
    }

    // Only blocked users are excluded — liked/matched users stay visible with a flag
    const excludedIds = await User.getExcludedUserIds(userId);

    const candidates = await User.findPotentialMatches({
      userId,
      gender: preferences.interested_in,
      minAge: preferences.min_age,
      maxAge: preferences.max_age,
      excludedIds,
    });

    // Fetch all swipe/match data in 3 queries — no N+1
    const { mySwipes, theirSwipes, matchedIds, matchIdMap } = await User.getInteractionMaps(userId);

    const results = [];

    for (const candidate of candidates) {
      const candidateLocation = await Location.get(candidate.user_id);
      if (!candidateLocation) continue;

      const distance = getDistanceFromLatLonInKm(
        parseFloat(userLocation.latitude),
        parseFloat(userLocation.longitude),
        parseFloat(candidateLocation.latitude),
        parseFloat(candidateLocation.longitude)
      );

      if (distance > preferences.max_distance_km) continue;

      const [photos, match_percentage] = await Promise.all([
        UserPhoto.getAll(candidate.user_id),
        calculateMatchPercentage(userId, candidate.user_id, UserInterest, Preference, Questionnaire),
      ]);

      const safeCandidate = Object.fromEntries(
        Object.entries(candidate).filter(([k]) => !HIDDEN.has(k))
      );

      results.push({
        ...safeCandidate,
        distance_km:        Math.round(distance * 10) / 10,
        match_percentage,
        photos,
        city:               candidateLocation.city || null,
        interaction_status: computeInteractionStatus(
          candidate.user_id, mySwipes, theirSwipes, matchedIds
        ),
        match_id: matchIdMap.get(candidate.user_id) ?? null,
      });
    }

    // Sort: unresponded first, then by match percentage
    const ORDER = { they_liked: 0, null: 1, i_liked: 2, i_superliked: 2, matched: 3, i_disliked: 4 };
    results.sort((a, b) => {
      const diff = (ORDER[a.interaction_status] ?? 1) - (ORDER[b.interaction_status] ?? 1);
      return diff !== 0 ? diff : b.match_percentage - a.match_percentage;
    });

    res.status(200).json({ status: true, message: 'Potential matches found', data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error', data: [] });
  }
};
