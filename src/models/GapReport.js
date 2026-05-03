const pool = require('../config/db');

const CATEGORY_DESCRIPTIONS = {
  'Relationship Goals': { high: 'Shared values around career and family', low: 'Different perspectives on relationship goals' },
  'Family & Children': { high: "You're aligned on future family plans and having children", low: 'Different perspectives on family and children' },
  'Shared Values': { high: 'You share similar values around family, loyalty, and long-term commitment', low: 'Different perspectives on core values' },
  'Lifestyle': { high: 'Strong compatibility in daily lifestyle and habits', low: 'Different perspectives on smoking and alcohol use' },
  'Personality': { high: 'Your personalities complement each other well', low: 'Different personality traits — worth exploring' },
  'Communication': { high: 'Strong compatibility in love languages and emotional expression', low: 'Different communication styles — worth discussing' },
  'Intimacy': { high: 'Aligned expectations around intimacy and closeness', low: 'Different perspectives on intimacy' },
  'Compatibility': { high: 'Strong overall compatibility in key areas', low: 'Some areas worth discussing together' }
};

const GapReport = {
  async get(matchId) {
    const [matchRows] = await pool.query(
      'SELECT user1_id, user2_id FROM matches WHERE match_id = ?',
      [matchId]
    );
    if (!matchRows.length) return [];

    const { user1_id, user2_id } = matchRows[0];

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

    const u2Map = {};
    for (const a of u2Answers) u2Map[a.question_id] = a;

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

    const report = Object.values(categoryScores).map(c => {
      const percent = c.total > 0 ? Math.round((c.matched / c.total) * 100) : 0;
      const desc = CATEGORY_DESCRIPTIONS[c.name];
      return {
        category: c.name,
        percent,
        description: desc ? (percent >= 60 ? desc.high : desc.low) : null
      };
    });

    return report;
  }
};

const MatchReasons = {
  async get(matchId) {
    const report = await GapReport.get(matchId);
    const reasons = [];

    for (const r of report) {
      const desc = CATEGORY_DESCRIPTIONS[r.category];
      if (r.percent >= 60) {
        reasons.push(desc ? desc.high : `Strong alignment on ${r.category}`);
      } else {
        reasons.push(desc ? desc.low : `Different perspectives on ${r.category}`);
      }
    }

    return reasons;
  }
};

module.exports = { GapReport, MatchReasons };
