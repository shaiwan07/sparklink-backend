// Dummy implementation for gap report and match reasons
const pool = require('../config/db');

const GapReport = {
  async get(matchId) {
    // Return static/dummy data for now
    return [
      { title: 'Relationship Goals', percent: 100, description: 'You\'re both seeking the same type of commitment and long-term relationship.' },
      { title: 'Family & Children', percent: 100, description: 'You\'re aligned on future family plans and having children.' },
      { title: 'Shared Values', percent: 100, description: 'You share similar values around family, loyalty, and long-term commitment.' },
    ];
  }
};

const MatchReasons = {
  async get(matchId) {
    return [
      'Shared values around career and family',
      'Strong compatibility in love languages and emotional expression',
      'Different perspectives on smoking and alcohol use'
    ];
  }
};

module.exports = { GapReport, MatchReasons };
