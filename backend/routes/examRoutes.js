const express = require('express');
const router = express.Router();
const {
    getExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam,
} = require('../controllers/examController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// Public routes for now (or student protected)
router.route('/').get(protect, getExams).post(protect, admin, createExam);
router
    .route('/:id')
    .get(protect, getExamById)
    .put(protect, admin, updateExam)
    .delete(protect, admin, deleteExam);

module.exports = router;
