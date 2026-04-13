const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/notifications', auth, notificationController.getNotifications);
router.put('/notifications/read-all', auth, notificationController.markAllAsRead);
router.put('/notifications/read', auth, notificationController.markAsRead);

module.exports = router;
