const { Question, Questionnaire } = require('../models/Questionnaire');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.getAll();
    // Each question now includes options array
    res.status(200).json(apiResponse({ status: true, message: 'Questions fetched', data: questions }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const userId = req.user.id;
    const answers = req.body.answers;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json(apiResponse({ status: false, message: 'No answers provided', data: [] }));
    }
    // answers: [{ question_id, option_id, answer }]
    await Questionnaire.submitAnswers(userId, answers);
    res.status(200).json(apiResponse({ status: true, message: 'Answers submitted', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.getUserAnswers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const answers = await Questionnaire.getUserAnswers(userId);
    res.status(200).json(apiResponse({ status: true, message: 'User answers fetched', data: answers }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
