const pool = require('../config/db');

const GapReport = {
  // Compute per-category compatibility between two matched users
  async get(matchId) {
    // Get both users for this match
    const [matchRows] = await pool.query(
      'SELECT user1_id, user2_id FROM matches WHERE match_id = ?',
      [matchId]
    );
    if (!matchRows.length) return [];

    const { user1_id, user2_id } = matchRows[0];

    // Get answers for both users with category info
    const [u1Answers] = await pool.query(
      `SELECT ua.question_id, ua.option_id, ua.answer, q.category_id, qc.name AS category_name
       FROM user_answers ua
       JOIN questions q ON ua.question_id = q.question_id
       JOIN question_categories qc ON q.category_id = qc.category_id
       WHERE ua.user_id = ?`,
      [user1_id]
    );

    const [u2Answers] = await pool.query(
      `SELECT ua.question_id, ua.option_id, ua.answer, q.category_id, qc.name AS category_name
       FROM user_answers ua
       JOIN questions q ON ua.question_id = q.question_id
       JOIN question_categories qc ON q.category_id = qc.category_id
       WHERE ua.user_id = ?`,
      [user2_id]
    );

    // Build lookup for user2 answers by question_id
    const u2Map = {};
    for (const a of u2Answers) u2Map[a.question_id] = a;

    // Compute per-category scores
    const categoryScores = {};
    for (const a1 of u1Answers) {
      const a2 = u2Map[a1.question_id];
      if (!a2) continue;

      const cat = a1.category_id;
      if (!categoryScores[cat]) {
        categoryScores[cat] = { name: a1.category_name, matched: 0, total: 0 };
      }
      categoryScores[cat].total++;

      const match =
        (a1.option_id && a2.option_id && a1.option_id === a2.option_id) ||
        (a1.answer && a2.answer && a1.answer === a2.answer);

      if (match) categoryScores[cat].matched++;
    }

    // Format result
    const report = Object.values(categoryScores).map(c => ({
      category: c.name,
      percent: c.total > 0 ? Math.round((c.matched / c.total) * 100) : 0
    }));

    return report;
  }
};

const MatchReasons = {
  // Derive "Why Do We Match?" reasons from high-scoring categories
  async get(matchId) {
    const report = await GapReport.get(matchId);
    const reasons = report
      .filter(r => r.percent >= 60)
      .map(r => `Strong alignment on ${r.category} (${r.percent}% match)`);

    const gaps = report
      .filter(r => r.percent < 60)
      .map(r => `Different perspectives on ${r.category} — worth discussing`);

    return [...reasons, ...gaps];
  }
};

module.exports = { GapReport, MatchReasons };
