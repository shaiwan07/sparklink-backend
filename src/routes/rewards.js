const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const auth = require('../middleware/auth');

router.get('/rewards', rewardController.getRewards);
router.get('/rewards/my-offers', auth, rewardController.getUserOffers);
router.post('/rewards/redeem', auth, rewardController.redeemOffer);

module.exports = router;
