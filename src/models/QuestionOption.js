const pool = require('../config/db');

const QuestionOption = {
  async getByQuestionId(question_id) {
    const [rows] = await pool.query('SELECT id, text FROM question_options WHERE question_id = ?', [question_id]);
    return rows;
  },
  async getAllForQuestions(questionIds) {
    if (!questionIds.length) return {};
    const [rows] = await pool.query('SELECT id, question_id, text FROM question_options WHERE question_id IN (?)', [questionIds]);
    // Group by question_id
    const map = {};
    for (const row of rows) {
      if (!map[row.question_id]) map[row.question_id] = [];
      map[row.question_id].push({ id: row.id, text: row.text });
    }
    return map;
  }
};

module.exports = QuestionOption;
