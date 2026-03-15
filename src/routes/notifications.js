const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get notifications
router.get('/notifications', auth, notificationController.getNotifications);
// Mark notification as read
router.post('/notifications/read', auth, notificationController.markAsRead);

module.exports = router;
