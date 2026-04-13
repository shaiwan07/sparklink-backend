const Availability = require('../models/Availability');
const Match = require('../models/Match');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// GET /api/availability  — get my availability slots
exports.getMyAvailability = async (req, res) => {
  try {
    const user_id = req.user.id;
    const slots = await Availability.getByUser(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Availability fetched', data: slots }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/availability  — set/replace my availability slots
// Body: { slots: [{ day_of_week, start_time, end_time }] }
exports.setMyAvailability = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { slots } = req.body;
    if (!Array.isArray(slots)) {
      return res.status(400).json(apiResponse({ status: false, message: 'slots array required', data: [] }));
    }
    const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (const s of slots) {
      if (!validDays.includes(s.day_of_week) || !s.start_time || !s.end_time) {
        return res.status(400).json(apiResponse({
          status: false,
          message: 'Each slot needs day_of_week (Mon-Sun), start_time and end_time',
          data: []
        }));
      }
    }
    await Availability.set(user_id, slots);
    res.status(200).json(apiResponse({ status: true, message: 'Availability updated', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/availability/:userId  — get another user's availability (must be a match)
exports.getUserAvailability = async (req, res) => {
  try {
    const my_id = req.user.id;
    const other_id = parseInt(req.params.userId);

    const match = await Match.getMatchBetween(my_id, other_id);
    if (!match) {
      return res.status(403).json(apiResponse({ status: false, message: 'You can only view availability of your matches', data: [] }));
    }

    const slots = await Availability.getByUser(other_id);
    res.status(200).json(apiResponse({ status: true, message: 'Availability fetched', data: slots }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/availability/overlap/:matchId?day=Mon  — find overlapping slots
exports.getOverlap = async (req, res) => {
  try {
    const my_id = req.user.id;
    const { matchId } = req.params;
    const { day } = req.query;

    const match = await Match.getMatchById(matchId);
    if (!match || (match.user1_id !== my_id && match.user2_id !== my_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }

    const other_id = match.user1_id === my_id ? match.user2_id : match.user1_id;
    const overlaps = await Availability.getOverlap(my_id, other_id, day || null);

    res.status(200).json(apiResponse({
      status: true,
      message: overlaps.length ? 'Overlapping slots found' : 'No matching times',
      data: overlaps
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
