const express = require('express');
const router = express.Router();
const videoCallController = require('../controllers/videoCallController');
const matchProfileController = require('../controllers/matchProfileController');
const auth = require('../middleware/auth');

// Schedule video call
router.post('/video-calls', auth, videoCallController.scheduleCall);
// Get user video calls
router.get('/video-calls', auth, videoCallController.getUserCalls);
// Update video call status
router.post('/video-calls/status', auth, videoCallController.updateStatus);
// Post-call feedback: love_it | not_a_match (screen 56) — must be before /:match_id
router.post('/video-calls/:callId/feedback', auth, matchProfileController.postCallFeedback);
// Get scheduled call for a specific match
router.get('/video-calls/:match_id', auth, videoCallController.getCallByMatchId);

module.exports = router;
