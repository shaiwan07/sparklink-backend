const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');

// GET /api/interests (public)
router.get('/', interestController.getAllInterests);

module.exports = router;
