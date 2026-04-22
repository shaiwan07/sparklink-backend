const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const auth = require('../middleware/auth');

router.get('/availability',                      auth, availabilityController.getMyAvailability);
router.post('/availability',                     auth, availabilityController.setMyAvailability);
router.post('/availability/request/:matchId',    auth, availabilityController.requestAvailability);
router.get('/availability/overlap/:matchId',     auth, availabilityController.getOverlap);
router.get('/availability/:userId',              auth, availabilityController.getUserAvailability);

module.exports = router;
