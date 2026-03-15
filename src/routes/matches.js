const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const auth = require('../middleware/auth');

// Like user
router.post('/matches/like', auth, matchController.likeUser);
// Dislike user
router.post('/matches/dislike', auth, matchController.dislikeUser);
// Get matches
router.get('/matches', auth, matchController.getMatches);
// Unmatch
router.post('/matches/unmatch', auth, matchController.unmatch);
// Block user
router.post('/matches/block', auth, matchController.block);

module.exports = router;
