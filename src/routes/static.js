const express = require('express');
const router = express.Router();
const staticController = require('../controllers/staticController');

router.get('/privacy-policy', staticController.privacyPolicy);
router.get('/terms',          staticController.termsAndConditions);
router.get('/about',          staticController.about);

module.exports = router;
