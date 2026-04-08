const express = require('express');
const router = express.Router();
const videoCallController = require('../controllers/videoCallController');
const auth = require('../middleware/auth');

// Schedule video call
router.post('/video-calls', auth, videoCallController.scheduleCall);
// Get user video calls
router.get('/video-calls', auth, videoCallController.getUserCalls);
// Update video call status
router.post('/video-calls/status', auth, videoCallController.updateStatus);
// Get scheduled call for a specific match
router.get('/video-calls/:match_id', auth, videoCallController.getCallByMatchId);

module.exports = router;
