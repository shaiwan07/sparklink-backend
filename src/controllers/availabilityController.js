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

// POST /api/availability/request/:matchId  — ask the other user to set their availability
// Max 3 requests per (match, requester) pair.
exports.requestAvailability = async (req, res) => {
  try {
    const from_user_id = req.user.id;
    const matchId      = parseInt(req.params.matchId);

    // Verify this is a confirmed match the caller is part of
    const match = await Match.getMatchById(matchId);
    if (!match || (match.user1_id !== from_user_id && match.user2_id !== from_user_id)) {
      return res.status(403).json(apiResponse({ status: false, message: 'Not authorized for this match', data: [] }));
    }

    const to_user_id = match.user1_id === from_user_id ? match.user2_id : match.user1_id;

    // If the other user already has availability set, no request needed
    const theirSlots = await Availability.getByUser(to_user_id);
    if (theirSlots.length > 0) {
      return res.status(400).json(apiResponse({
        status:  false,
        message: 'This user has already set their availability. You can now schedule a call.',
        data:    []
      }));
    }

    // Enforce the 3-request limit — check BEFORE incrementing
    const currentCount = await AvailabilityRequest.getCount(matchId, from_user_id);
    if (currentCount >= AvailabilityRequest.MAX_REQUESTS) {
      return res.status(429).json(apiResponse({
        status:  false,
        message: `You can only send ${AvailabilityRequest.MAX_REQUESTS} availability requests per match. Limit reached.`,
        data:    [{ requests_sent: currentCount, requests_remaining: 0 }]
      }));
    }

    // Increment counter and send notification
    const newCount = await AvailabilityRequest.increment(matchId, from_user_id, to_user_id);
    const remaining = AvailabilityRequest.MAX_REQUESTS - newCount;

    // Fetch requester name for the notification message
    const requester = await User.findById(from_user_id);
    const requesterName = requester?.full_name || 'Your match';
    const msg = `${requesterName} wants to schedule a video date with you! Please add your available times so you can connect.`;

    // reference_id = from_user_id so the recipient can navigate to the requester's profile
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
