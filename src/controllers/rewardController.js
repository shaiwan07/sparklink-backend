const { Reward, UserOffer } = require('../models/Reward');
const Notification = require('../models/Notification');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// GET /api/rewards
exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.getAll();
    res.status(200).json(apiResponse({ status: true, message: 'Rewards fetched', data: rewards }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// GET /api/rewards/my-offers
exports.getUserOffers = async (req, res) => {
  try {
    const user_id = req.user.id;
    const offers = await UserOffer.getUserOffers(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Your offers fetched', data: offers }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// POST /api/rewards/redeem
exports.redeemOffer = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { reward_id } = req.body;
    if (!reward_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'reward_id required', data: [] }));
    }
    const reward = await Reward.getById(reward_id);
    if (!reward) {
      return res.status(404).json(apiResponse({ status: false, message: 'Reward not found or expired', data: [] }));
    }
    const alreadyRedeemed = await UserOffer.hasRedeemed(user_id, reward_id);
    if (alreadyRedeemed) {
      return res.status(409).json(apiResponse({ status: false, message: 'You have already redeemed this reward', data: [] }));
    }
    await UserOffer.redeemOffer(user_id, reward_id);

    // Notify user about their new reward
    Notification.create(
      user_id,
      'reward',
      `Your reward "${reward.name}" is ready! Show the QR code at the venue.`,
      { reward_id: String(reward_id) }
    ).catch(() => {});

    res.status(200).json(apiResponse({ status: true, message: 'Reward redeemed successfully', data: [reward] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
