const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const matchesController = require('../controllers/matchesController');
const auth = require('../middleware/auth');

router.get('/matches', auth, matchController.getMatches);
router.get('/matches/potential', auth, matchesController.getPotentialMatches);
router.post('/matches/like', auth, matchController.likeUser);
router.post('/matches/superlike', auth, matchController.superlikeUser);
router.post('/matches/dislike', auth, matchController.dislikeUser);
router.post('/matches/unmatch', auth, matchController.unmatch);
router.post('/matches/block', auth, matchController.block);

module.exports = router;
