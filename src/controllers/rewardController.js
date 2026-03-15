const { Reward, UserOffer } = require('../models/Reward');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.getAll();
    res.status(200).json(apiResponse({ status: true, message: 'Rewards fetched', data: rewards }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.getUserOffers = async (req, res) => {
  try {
    const user_id = req.user.id;
    const offers = await UserOffer.getUserOffers(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'User offers fetched', data: offers }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

exports.redeemOffer = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { offer_id } = req.body;
    if (!offer_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'offer_id required', data: [] }));
    }
    await UserOffer.redeemOffer(user_id, offer_id);
    res.status(200).json(apiResponse({ status: true, message: 'Offer redeemed', data: [] }));
  } catch (err) {
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
