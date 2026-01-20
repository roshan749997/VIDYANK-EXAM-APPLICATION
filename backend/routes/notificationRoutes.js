const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    createNotification,
} = require('../controllers/notificationController.js');
const { protect } = require('../middleware/authMiddleware.js');

// All routes require authentication
router.route('/').get(protect, getNotifications).post(protect, createNotification);
router.route('/unread-count').get(protect, getUnreadCount);
router.route('/read-all').put(protect, markAllAsRead);
router.route('/:id/read').put(protect, markAsRead);
router.route('/:id').delete(protect, deleteNotification);

module.exports = router;
