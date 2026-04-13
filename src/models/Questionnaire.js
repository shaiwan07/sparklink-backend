const QuestionOption = require('./QuestionOption');
const pool = require('../config/db');

const Question = {
  async getAll() {
    const [questions] = await pool.query(
      `SELECT q.question_id, q.text, q.type, q.sort_order,
              qc.category_id, qc.name AS category_name
       FROM questions q
       JOIN question_categories qc ON q.category_id = qc.category_id
       ORDER BY qc.sort_order, q.sort_order`
    );
    const questionIds = questions.map(q => q.question_id);
    const optionsMap = await QuestionOption.getAllForQuestions(questionIds);
    return questions.map(q => ({
      ...q,
      options: optionsMap[q.question_id] || []
    }));
  },

  async getByCategory() {
    const questions = await Question.getAll();
    const categories = {};
    for (const q of questions) {
      if (!categories[q.category_id]) {
        categories[q.category_id] = { category_id: q.category_id, name: q.category_name, questions: [] };
      }
      categories[q.category_id].questions.push(q);
    }
    return Object.values(categories);
  }
};

const Questionnaire = {
  // answers: [{ question_id, option_id, answer }]
  async submitAnswers(user_id, answers) {
    for (const ans of answers) {
      await pool.query(
        `INSERT INTO user_answers (user_id, question_id, option_id, answer)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE option_id = VALUES(option_id), answer = VALUES(answer)`,
        [user_id, ans.question_id, ans.option_id || null, ans.answer || null]
      );
    }
  },

  async getUserAnswers(user_id) {
    const [rows] = await pool.query(
      `SELECT q.question_id, q.text, q.type, q.category_id,
              ua.option_id, qo.text AS option_text, ua.answer
       FROM questions q
       LEFT JOIN user_answers ua ON q.question_id = ua.question_id AND ua.user_id = ?
       LEFT JOIN question_options qo ON ua.option_id = qo.option_id
       ORDER BY q.sort_order`,
      [user_id]
    );
    return rows;
  },

  async getAnsweredCount(user_id) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM user_answers WHERE user_id = ?',
      [user_id]
    );
    return rows[0].count;
  }
};

module.exports = { Question, Questionnaire };
