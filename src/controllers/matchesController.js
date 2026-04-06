const User = require('../models/User');
const Preference = require('../models/Preference');
const Location = require('../models/Location');
const UserPhoto = require('../models/UserPhoto');
const { getDistanceFromLatLonInKm } = require('../helpers/locationHelper');

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
      if (distance <= preferences.max_distance_km) {
        const photos = await UserPhoto.getAll(candidate.id);
        // Remove sensitive fields
        const { password_hash, ...safeCandidate } = candidate;
        matches.push({ ...safeCandidate, distance, photos });
      }
    }
    res.status(200).json({ status: true, message: 'Matches found', data: matches });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server error', data: [] });
  }
};
