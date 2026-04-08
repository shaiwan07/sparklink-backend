const express = require('express');
const router = express.Router();
const gapReportController = require('../controllers/gapReportController');
const auth = require('../middleware/auth');

// Get gap report for a match
router.get('/gap-report/:matchId', auth, gapReportController.getGapReport);
// Get match reasons for a match
router.get('/gap-report/:matchId/reasons', auth, gapReportController.getMatchReasons);

module.exports = router;
