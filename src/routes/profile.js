const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Upload profile photo
router.post('/profile/photo', auth, profileController.uploadProfilePhoto);
router.get('/profile', auth, profileController.getProfile);
router.put('/profile', auth, profileController.updateProfile);


module.exports = router;
