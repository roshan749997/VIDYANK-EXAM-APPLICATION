const express = require('express');
const router = express.Router();
const {
    createExamResult,
    getUserExamResults,
    getExamResultById,
    updateExamResult,
    deleteExamResult,
    getUserPerformanceStats,
    getUserProgress,
    getLeaderboard,
} = require('../controllers/examResultController.js');
const { protect } = require('../middleware/authMiddleware.js');

// All routes require authentication
// IMPORTANT: Specific routes MUST come before dynamic /:id route
router.route('/').post(protect, createExamResult).get(protect, getUserExamResults);
router.route('/stats/performance').get(protect, getUserPerformanceStats);
router.route('/stats/progress').get(protect, getUserProgress);
router.route('/leaderboard').get(protect, getLeaderboard);
// Dynamic route MUST be last
router.route('/:id').get(protect, getExamResultById).put(protect, updateExamResult).delete(protect, deleteExamResult);

module.exports = router;
