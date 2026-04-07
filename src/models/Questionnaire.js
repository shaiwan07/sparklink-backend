
const QuestionOption = require('./QuestionOption');
const pool = require('../config/db');

const Question = {
  async getAll() {
    const [questions] = await pool.query('SELECT * FROM questions');
    const questionIds = questions.map(q => q.id);
    const optionsMap = await QuestionOption.getAllForQuestions(questionIds);
    return questions.map(q => ({
      ...q,
      options: optionsMap[q.id] || []
    }));
  }
};

const Questionnaire = {
  // answers: [{ question_id, option_id, answer }]
  async submitAnswers(user_id, answers) {
    for (const ans of answers) {
      // If option_id is present, save it, else save answer (for scale/text)
      await pool.query(
        'INSERT INTO questionnaire (user_id, question_id, option_id, answer) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE option_id=VALUES(option_id), answer=VALUES(answer)',
        [user_id, ans.question_id, ans.option_id || null, ans.answer || null]
      );
    }
  },
  async getUserAnswers(user_id) {
    // Return question, type, and selected option text if present
    const [rows] = await pool.query(`
      SELECT q.id as question_id, q.text, q.type, qa.option_id, qo.text as option_text, qa.answer
      FROM questions q
      LEFT JOIN questionnaire qa ON q.id = qa.question_id AND qa.user_id = ?
      LEFT JOIN question_options qo ON qa.option_id = qo.id
    `, [user_id]);
    return rows;
  }
};

module.exports = { Question, Questionnaire };
