const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload profile photo (multiple)
router.post('/profile/photo', auth, upload.array('files', 5), profileController.uploadProfilePhoto);
router.get('/profile', auth, profileController.getProfile);
router.put('/profile', auth, profileController.updateProfile);


module.exports = router;
