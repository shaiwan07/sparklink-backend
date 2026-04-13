const pool = require('../config/db');

// Calculates match percentage based on shared interests, preferences alignment,
// and questionnaire answer overlap. Returns 0–100.
async function calculateMatchPercentage(userId, candidateId, UserInterest, Preference, Questionnaire) {
  // --- Interests score (40%) ---
  const userInterests = await UserInterest.getUserInterests(userId);
  const candidateInterests = await UserInterest.getUserInterests(candidateId);
  let interestsScore = 0;
  if (userInterests.length && candidateInterests.length) {
    const userIds = userInterests.map(i => i.interest_id);
    const candIds = candidateInterests.map(i => i.interest_id);
    const shared = userIds.filter(id => candIds.includes(id));
    interestsScore = shared.length / Math.max(userIds.length, 1);
  }

  // --- Preferences alignment score (30%) ---
  // Gender/age come from the users table, distance handled separately at call site
  let preferencesScore = 0;
  const userPref = await Preference.get(userId);
  const candidatePref = await Preference.get(candidateId);

  if (userPref && candidatePref) {
    // Fetch candidate user row for gender + age
    const [candRows] = await pool.query(
      'SELECT gender, age FROM users WHERE user_id = ?',
      [candidateId]
    );
    const candUser = candRows[0];

    if (candUser) {
      let matchCount = 0;
      const total = 2;

      // Gender preference
      if (userPref.interested_in === 'all' || candUser.gender === userPref.interested_in) matchCount++;

      // Age in range
      if (
        userPref.min_age && userPref.max_age &&
        candUser.age >= userPref.min_age && candUser.age <= userPref.max_age
      ) matchCount++;

      preferencesScore = matchCount / total;
    }
  }

  // --- Questionnaire score (30%) ---
  let questionnaireScore = 0;
  const userAnswers = await Questionnaire.getUserAnswers(userId);
  const candidateAnswers = await Questionnaire.getUserAnswers(candidateId);
  if (userAnswers.length && candidateAnswers.length) {
    const candMap = {};
    for (const a of candidateAnswers) candMap[a.question_id] = a;

    let matched = 0;
    let total = 0;
    for (const q of userAnswers) {
      if (!q.option_id && !q.answer) continue; // unanswered
      const cand = candMap[q.question_id];
      if (!cand || (!cand.option_id && !cand.answer)) continue;

      total++;
      if (q.option_id && cand.option_id && q.option_id === cand.option_id) matched++;
      else if (q.answer && cand.answer && q.answer === cand.answer) matched++;
    }
    if (total > 0) questionnaireScore = matched / total;
  }

  const percent = Math.round(
    interestsScore * 40 +
    preferencesScore * 30 +
    questionnaireScore * 30
  );

  return Math.min(100, Math.max(0, percent));
}

module.exports = { calculateMatchPercentage };
