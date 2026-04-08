const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

// Report a user for harassment or other reasons
router.post('/report', auth, reportController.createReport);

module.exports = router;
