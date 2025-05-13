const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// GET /api/notifications - Get all notifications for the current user
router.get('/', verifyToken, notificationController.getUserNotifications);

// POST /api/notifications/:id/respond - Respond to a notification
router.post('/:id/respond', verifyToken, notificationController.respondToNotification);

module.exports = router;
