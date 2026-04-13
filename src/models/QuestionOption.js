const pool = require('../config/db');

const QuestionOption = {
  async getByQuestionId(question_id) {
    const [rows] = await pool.query(
      'SELECT option_id, text FROM question_options WHERE question_id = ? ORDER BY option_id',
      [question_id]
    );
    return rows;
  },

  async getAllForQuestions(questionIds) {
    if (!questionIds.length) return {};
    const [rows] = await pool.query(
      'SELECT option_id, question_id, text FROM question_options WHERE question_id IN (?) ORDER BY option_id',
      [questionIds]
    );
    const map = {};
    for (const row of rows) {
      if (!map[row.question_id]) map[row.question_id] = [];
      map[row.question_id].push({ option_id: row.option_id, text: row.text });
    }
    return map;
  }
};

module.exports = QuestionOption;
