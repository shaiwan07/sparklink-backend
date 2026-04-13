const express = require('express');
const router = express.Router();
const matchProfileController = require('../controllers/matchProfileController');
const auth = require('../middleware/auth');

// GET /api/matches/:matchId/profile — full profile + compatibility (screens 50-51)
router.get('/matches/:matchId/profile', auth, matchProfileController.getMatchProfile);

// GET /api/matches/:matchId/contact — phone + Instagram (screen 55)
router.get('/matches/:matchId/contact', auth, matchProfileController.getMatchContact);

module.exports = router;
