const Notification = require('../models/Notification');
const MSG = require('../constants/error');

function apiResponse({ status, message, data }) {
  return { status, message, data };
}

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const notifications = await Notification.getAll(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'Notifications fetched', data: notifications }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// PUT /api/notifications/read
exports.markAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { notification_id } = req.body;
    if (!notification_id) {
      return res.status(400).json(apiResponse({ status: false, message: 'notification_id required', data: [] }));
    }
    await Notification.markAsRead(user_id, notification_id);
    res.status(200).json(apiResponse({ status: true, message: 'Notification marked as read', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};

// PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    await Notification.markAllAsRead(user_id);
    res.status(200).json(apiResponse({ status: true, message: 'All notifications marked as read', data: [] }));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse({ status: false, message: MSG.SERVER_ERROR, data: [] }));
  }
};
