const User = require('../models/User');
const Preference = require('../models/Preference');
const Location = require('../models/Location');
const UserPhoto = require('../models/UserPhoto');
const { getDistanceFromLatLonInKm } = require('../helpers/locationHelper');
const { calculateMatchPercentage } = require('../helpers/matchHelper');
const UserInterest = require('../models/Interest');
const Preference = require('../models/Preference');
const { Questionnaire } = require('../models/Questionnaire');

exports.getPotentialMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = await Preference.get(userId);
    const userLocation = await Location.get(userId);
    if (!preferences || !userLocation) {
      return res.status(400).json({ status: false, message: 'Complete your profile and preferences first', data: [] });
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
      if (candidate.id === userId) continue; // Exclude self
      const candidateLocation = await Location.get(candidate.id);
      if (!candidateLocation) {
        continue;
      }
      const distance = getDistanceFromLatLonInKm(
        parseFloat(userLocation.latitude), parseFloat(userLocation.longitude),
        parseFloat(candidateLocation.latitude), parseFloat(candidateLocation.longitude)
      );
      const roundedDistance = Math.round(distance * 10) / 10;
      if (distance <= preferences.max_distance_km) {
        const photos = await UserPhoto.getAll(candidate.id);
        // Calculate match percentage (interests, preferences, questionnaire)
        const match_percentage = await calculateMatchPercentage(
          userId,
          candidate.id,
          UserInterest,
          Preference,
          Questionnaire
        );
        // Remove sensitive fields
        const { password_hash, ...safeCandidate } = candidate;
        matches.push({ ...safeCandidate, distance: roundedDistance, match_percentage, photos });
      }
    }
    res.status(200).json({ status: true, message: 'Matches found', data: matches });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server error', data: [] });
  }
};
