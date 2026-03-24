const pool = require('../config/db');

const Question = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM questions');
    return rows;
  }
};

const Questionnaire = {
  async submitAnswers(user_id, answers) {
    // answers: [{ question_id, answer }]
    for (const ans of answers) {
      await pool.query(
        'INSERT INTO questionnaire (user_id, question_id, answer) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE answer=?',
        [user_id, ans.question_id, ans.answer, ans.answer]
      );
    }
  },
  async getUserAnswers(user_id) {
    const [rows] = await pool.query(
      'SELECT q.id as question_id, q.text, q.type, qa.answer FROM questions q LEFT JOIN questionnaire qa ON q.id = qa.question_id AND qa.user_id = ?',[user_id]
    );
    return rows;
  }
};

module.exports = { Question, Questionnaire };
