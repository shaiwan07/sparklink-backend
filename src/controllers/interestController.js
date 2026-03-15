const Interest = require('../models/Interest');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// GET /api/interests (public, no token required)
exports.getAllInterests = async (req, res) => {
  try {
    const interests = await Interest.getAll();
    res.status(200).json(apiResponse({ status: true, message: 'Interests fetched', data: interests }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
