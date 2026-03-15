const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const auth = require('../middleware/auth');

// Get all rewards
router.get('/rewards', rewardController.getRewards);
// Get user offers
router.get('/user-offers', auth, rewardController.getUserOffers);
// Redeem offer
router.post('/user-offers/redeem', auth, rewardController.redeemOffer);

module.exports = router;
