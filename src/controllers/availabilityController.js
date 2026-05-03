const Availability = require('../models/Availability');
const AvailabilityRequest = require('../models/AvailabilityRequest');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const User = require('../models/User');
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
// Body: { slots: [{ date: "2026-05-04", time: "10:00" }] }
exports.setMyAvailability = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { slots } = req.body;
    if (!Array.isArray(slots)) {
      return res.status(400).json(apiResponse({ status: false, message: 'slots array required', data: [] }));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    for (const s of slots) {
      if (!s.date || !s.time) {
        return res.status(400).json(apiResponse({
          status: false,
          message: 'Each slot needs date and time',
          data: []
        }));
      }
      if (!Availability.ALLOWED_TIMES.includes(s.time)) {
        return res.status(400).json(apiResponse({
          status: false,
          message: `Invalid time. Allowed times: ${Availability.ALLOWED_TIMES.join(', ')}`,
          data: []
        }));
      }
      const slotDate = new Date(s.date);
      slotDate.setHours(0, 0, 0, 0);
      if (slotDate < today || slotDate >= dayAfter) {
        return res.status(400).json(apiResponse({
          status: false,
          message: 'Slots can only be set for today or tomorrow',
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

// POST /api/availability/request/:matchId  — ask the other user to set their availability
exports.requestAvailability = async (req, res) => {
  try {
    const from_user_id = req.user.id;
    const matchId      = parseInt(req.params.matchId);

    const match = await Match.getMatchById(matchId);
    if (!match || (match.user1_id !== from_user_id && match.user2_id !== from_user_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized for this match', data: [] }));
    }

    const to_user_id = match.user1_id === from_user_id ? match.user2_id : match.user1_id;

    const theirSlots = await Availability.getByUser(to_user_id);
    if (theirSlots.length > 0) {
      return res.status(400).json(apiResponse({
        status:  false,
        message: 'This user has already set their availability. You can now schedule a call.',
        data:    []
      }));
    }

    const currentCount = await AvailabilityRequest.getCount(matchId, from_user_id);
    if (currentCount >= AvailabilityRequest.MAX_REQUESTS) {
      return res.status(429).json(apiResponse({
        status:  false,
        message: `You can only send ${AvailabilityRequest.MAX_REQUESTS} availability requests per match. Limit reached.`,
        data:    [{ requests_sent: currentCount, requests_remaining: 0 }]
      }));
    }

    const newCount = await AvailabilityRequest.increment(matchId, from_user_id, to_user_id);
    const remaining = AvailabilityRequest.MAX_REQUESTS - newCount;

    const requester = await User.findById(from_user_id);
    const requesterName = requester?.full_name || 'Your match';
    const msg = `${requesterName} wants to schedule a video date with you! Please add your available times so you can connect.`;

    Notification.create(to_user_id, 'availability_request', msg, {}, from_user_id).catch(() => {});

    return res.status(200).json(apiResponse({
      status:  true,
      message: remaining > 0
        ? `Request sent. You have ${remaining} request${remaining === 1 ? '' : 's'} remaining.`
        : 'Request sent. This was your last request for this match.',
      data: [{ requests_sent: newCount, requests_remaining: remaining }]
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/availability/overlap/:matchId?date=2026-05-04  — find overlapping slots
exports.getOverlap = async (req, res) => {
  try {
    const my_id = req.user.id;
    const { matchId } = req.params;
    const { date } = req.query;

    const match = await Match.getMatchById(matchId);
    if (!match || (match.user1_id !== my_id && match.user2_id !== my_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized', data: [] }));
    }

    const other_id = match.user1_id === my_id ? match.user2_id : match.user1_id;
    const overlaps = await Availability.getOverlap(my_id, other_id, date || null);

    // Suggest the earliest overlapping slot
    const suggested = overlaps.length > 0 ? {
      availability_id: overlaps[0].availability_id,
      slot_date: overlaps[0].slot_date,
      slot_time: overlaps[0].slot_time
    } : null;

    res.status(200).json(apiResponse({
      status: true,
      message: overlaps.length ? 'Overlapping slots found' : 'No matching times on this day',
      data: {
        suggested,
        overlaps
      }
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
