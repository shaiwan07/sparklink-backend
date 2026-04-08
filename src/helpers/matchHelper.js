// Calculates match percentage based on interests, preferences, and questionnaire answers
async function calculateMatchPercentage(userId, candidateId, UserInterest, Preference, Questionnaire) {
  // Interests
  const userInterests = await UserInterest.getUserInterests(userId);
  const candidateInterests = await UserInterest.getUserInterests(candidateId);
  let interestsScore = 0;
  if (userInterests.length && candidateInterests.length) {
    const userInterestIds = userInterests.map(i => i.id);
    const candidateInterestIds = candidateInterests.map(i => i.id);
    const shared = userInterestIds.filter(id => candidateInterestIds.includes(id));
    interestsScore = shared.length / userInterestIds.length;
  }

  // Preferences (age, gender, city)
  let preferencesScore = 0;
  const userPref = await Preference.get(userId);
  const candidatePref = await Preference.get(candidateId);
  const candidate = candidatePref ? candidatePref : {};
  if (userPref && candidatePref) {
    let matchCount = 0, total = 3;
    // Gender
    if (candidatePref.gender === userPref.interested_in || userPref.interested_in === 'all') matchCount++;
    // City
    if (candidatePref.city && userPref.city && candidatePref.city === userPref.city) matchCount++;
    // Age
    if (candidatePref.age >= userPref.min_age && candidatePref.age <= userPref.max_age) matchCount++;
    preferencesScore = matchCount / total;
  }

  // Questionnaire
  let questionnaireScore = 0;
  const userAnswers = await Questionnaire.getUserAnswers(userId);
  const candidateAnswers = await Questionnaire.getUserAnswers(candidateId);
  if (userAnswers.length && candidateAnswers.length) {
    let match = 0, total = 0;
    for (const q of userAnswers) {
      const cand = candidateAnswers.find(c => c.question_id === q.question_id);
      if (cand) {
        total++;
        if (q.option_id && cand.option_id && q.option_id === cand.option_id) match++;
        else if (q.answer && cand.answer && q.answer === cand.answer) match++;
      }
    }
    if (total > 0) questionnaireScore = match / total;
  }

  // Weighted sum
  const percent = Math.round(
    interestsScore * 40 +
    preferencesScore * 30 +
    questionnaireScore * 30
  );
  return percent;
}

module.exports = { calculateMatchPercentage };
