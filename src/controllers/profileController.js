const User = require('../models/User');
const UserPhoto = require('../models/UserPhoto');
const Interest = require('../models/Interest');
const Location = require('../models/Location');
const Preference = require('../models/Preference');
const customUploader = require('../helpers/customUploader');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(apiResponse({ status: false, message: 'User not found', data: [] }));
    }
    const [interests, location, preferences, photos] = await Promise.all([
      Interest.getUserInterests(userId),
      Location.get(userId),
      Preference.get(userId),
      UserPhoto.getAll(userId)
    ]);
    const { password_hash, ...safeUser } = user;
    res.status(200).json(apiResponse({
      status: true,
      message: 'Profile fetched',
      data: [{ user: safeUser, interests, location, preferences, photos }]
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Whitelisted user table fields (phone not phone_number, no city — city lives in user_location)
    const userFields = ['phone', 'full_name', 'age', 'gender', 'bio', 'language', 'current_step'];
    const updateUser = {};
    for (const field of userFields) {
      if (req.body[field] !== undefined) updateUser[field] = req.body[field];
    }
    if (Object.keys(updateUser).length > 0) {
      const sets = Object.keys(updateUser).map(f => `${f} = ?`).join(', ');
      const values = [...Object.values(updateUser), userId];
      await User.updateFields(sets, values);
    }

    // Interests
    if (req.body.interests !== undefined) {
      await Interest.setUserInterests(userId, req.body.interests);
    }

    // Preferences (no height — not in DB)
    const prefFields = ['interested_in', 'min_age', 'max_age', 'max_distance_km'];
    const prefData = {};
    for (const field of prefFields) {
      if (req.body[field] !== undefined) prefData[field] = req.body[field];
    }
    if (Object.keys(prefData).length > 0) {
      await Preference.upsert(userId, prefData);
    }

    // Location — save lat/lng if provided, city separately
    if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
      await Location.upsert(userId, req.body.latitude, req.body.longitude, req.body.city || null);
    } else if (req.body.city !== undefined) {
      await Location.updateCity(userId, req.body.city);
    }

    res.status(200).json(apiResponse({ status: true, message: 'Profile updated', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/profile/photo  (multipart, up to 5 files)
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json(apiResponse({ status: false, message: 'No files uploaded', data: [] }));
    }
    const photoUrls = [];
    for (const file of req.files) {
      const url = await customUploader({ file, folder: 'profile_photos' });
      if (url) {
        await UserPhoto.add(userId, url);
        photoUrls.push(url);
      }
    }
    // Set first uploaded photo as the main profile photo
    if (photoUrls.length > 0) {
      await User.updateFields('profile_photo_url = ?', [photoUrls[0], userId]);
    }
    res.status(200).json(apiResponse({ status: true, message: 'Photos uploaded', data: photoUrls }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// PUT /api/profile/fcm-token  — register / refresh device push token
exports.updateFcmToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fcm_token } = req.body;
    if (!fcm_token) {
      return res.status(400).json(apiResponse({ status: false, message: 'fcm_token is required', data: [] }));
    }
    await User.updateFields('fcm_token = ?', [fcm_token, userId]);
    res.status(200).json(apiResponse({ status: true, message: 'FCM token registered', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// DELETE /api/profile/photo/:photoId
exports.deleteProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoId } = req.params;
    await UserPhoto.delete(userId, photoId);
    res.status(200).json(apiResponse({ status: true, message: 'Photo deleted', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
