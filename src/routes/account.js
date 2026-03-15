const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const auth = require('../middleware/auth');

// Delete account
router.post('/profile/delete', auth, accountController.deleteAccount);
// Update settings
router.post('/profile/settings', auth, accountController.updateSettings);

module.exports = router;
