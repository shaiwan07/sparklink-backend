const User = require('../models/User');
const Preference = require('../models/Preference');
const Location = require('../models/Location');
const UserPhoto = require('../models/UserPhoto');
const UserInterest = require('../models/Interest');
const { Questionnaire } = require('../models/Questionnaire');
const { getDistanceFromLatLonInKm } = require('../helpers/locationHelper');
const { calculateMatchPercentage } = require('../helpers/matchHelper');

// GET /api/matches/potential
exports.getPotentialMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const preferences = await Preference.get(userId);
    const userLocation = await Location.get(userId);

    if (!preferences || !userLocation) {
      return res.status(400).json({
        status: false,
        message: 'Complete your profile, preferences and location first',
        data: []
      });
    }

    const excludedIds = await User.getExcludedUserIds(userId);

    const candidates = await User.findPotentialMatches({
      userId,
      gender: preferences.interested_in,
      minAge: preferences.min_age,
      maxAge: preferences.max_age,
      excludedIds
    });

    const matches = [];

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
        calculateMatchPercentage(userId, candidate.user_id, UserInterest, Preference, Questionnaire)
      ]);

      const { password_hash, ...safeCandidate } = candidate;
      matches.push({
        ...safeCandidate,
        distance_km: Math.round(distance * 10) / 10,
        match_percentage,
        photos,
        city: candidateLocation.city || null
      });
    }

    // Sort by match percentage descending
    matches.sort((a, b) => b.match_percentage - a.match_percentage);

    res.status(200).json({ status: true, message: 'Potential matches found', data: matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error', data: [] });
  }
};
