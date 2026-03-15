const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');
const auth = require('../middleware/auth');

// Get all questions
router.get('/questions', questionnaireController.getQuestions);
// Submit answers (protected)
router.post('/questionnaire', auth, questionnaireController.submitAnswers);
// Get user answers
router.get('/questionnaire/:userId', questionnaireController.getUserAnswers);

module.exports = router;
