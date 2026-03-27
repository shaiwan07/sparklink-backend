const User = require('../models/User');
const Profile = require('../models/Profile');
const UserPhoto = require('../models/UserPhoto');
const Interest = require('../models/Interest');
const Location = require('../models/Location');
const Preference = require('../models/Preference');
const customUploader = require('../helpers/customUploader');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// Get full user profile: user info, interests, location, preferences
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById ? await User.findById(userId) : await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: 'User not found', data: [] }));
    }
    const interests = await Interest.getUserInterests(userId);
    const location = await Location.get(userId);
    const preferences = await Preference.get(userId);
    const photos = await UserPhoto.getAll(userId);
    const profile = { user, interests, location, preferences, photos };
    res.status(200).json(apiResponse({ status: true, message: 'Profile fetched', data: [profile] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const allowedFields = ['phone_number', 'full_name', 'age', 'gender', 'city', 'bio', 'language', 'current_step'];
    const updateUser = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateUser[field] = req.body[field];
    }
    if (Object.keys(updateUser).length > 0) {
      const sets = Object.keys(updateUser).map(f => `${f}=?`).join(', ');
      const values = Object.values(updateUser);
      values.push(userId);
      await User.updateFields(sets, values);
    }
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await customUploader({ file, folder: 'profile_photos' });
        if (url) {
          await UserPhoto.add(userId, url);
          photoUrls.push(url);
        }
      }
    }
    if (photoUrls.length > 0) {
      await User.updateFields('profile_photo_url=?', [photoUrls[0], userId]);
    }
    if (req.body.interests) {
      await Interest.setUserInterests(userId, req.body.interests);
    }
    const prefFields = [
      'interested_in', 'min_age', 'max_age', 'min_height', 'max_height', 'max_distance_km'
    ];
    const prefData = {};
    for (const field of prefFields) {
      if (req.body[field] !== undefined) prefData[field] = req.body[field];
    }
    if (Object.keys(prefData).length > 0) {
      await Preference.upsert(userId, prefData);
    }
    if (req.body.latitude && req.body.longitude) {
      await Location.upsert(userId, req.body.latitude, req.body.longitude);
    }
    res.status(200).json(apiResponse({ status: true, message: 'Profile updated', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// Example: Upload profile photo (calls customUploader and Profile model)
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json(apiResponse({ status: false, message: 'No file uploaded', data: [] }));
    }
    const url = await customUploader({ file: req.file, folder: 'profile_photos' });
    // await UserPhoto.add(userId, url);
    res.status(200).json(apiResponse({ status: true, message: 'Photo uploaded', data: [url] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// Get all interests with icon support
