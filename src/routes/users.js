const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// GET /api/users/:userId/profile
// Public profile — tap a notification to view who liked you (no match required)
router.get('/users/:userId/profile', auth, userController.getUserProfile);

module.exports = router;
