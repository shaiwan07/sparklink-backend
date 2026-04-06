const User = require('../models/User');
const Preference = require('../models/Preference');
const Location = require('../models/Location');
const UserPhoto = require('../models/UserPhoto');
const { getDistanceFromLatLonInKm } = require('../helpers/locationHelper');

exports.getPotentialMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('getPotentialMatches: userId', userId);
    const preferences = await Preference.get(userId);
    console.log('Preferences:', preferences);
    const userLocation = await Location.get(userId);
    console.log('User Location:', userLocation);
    if (!preferences || !userLocation) {
      console.log('Missing preferences or location');
      return res.status(400).json({ status: false, message: 'Complete your profile and preferences first', data: [] });
    }
    const excludedIds = await User.getExcludedUserIds(userId);
    console.log('Excluded IDs:', excludedIds);
    const candidates = await User.findPotentialMatches({
      userId,
      gender: preferences.interested_in,
      minAge: preferences.min_age,
      maxAge: preferences.max_age,
      excludedIds
    });
    console.log('Candidates:', candidates);
    const matches = [];
    for (const candidate of candidates) {
      const candidateLocation = await Location.get(candidate.id);
      if (!candidateLocation) {
        console.log('Candidate', candidate.id, 'has no location');
        continue;
      }
      const distance = getDistanceFromLatLonInKm(
        parseFloat(userLocation.latitude), parseFloat(userLocation.longitude),
        parseFloat(candidateLocation.latitude), parseFloat(candidateLocation.longitude)
      );
      console.log(`Candidate ${candidate.id} distance:`, distance);
      if (distance <= preferences.max_distance_km) {
        const photos = await UserPhoto.getAll(candidate.id);
        matches.push({ ...candidate, distance, photos });
      }
    }
    console.log('Final matches:', matches);
    res.status(200).json({ status: true, message: 'Matches found', data: matches });
  } catch (err) {
    console.error('getPotentialMatches error:', err);
    res.status(500).json({ status: false, message: 'Server error', data: [] });
  }
};
