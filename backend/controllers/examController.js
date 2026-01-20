const Exam = require('../models/Exam.js');

// @desc    Fetch all exams
// @route   GET /api/exams
// @access  Private
const getExams = async (req, res) => {
    try {
        const exams = await Exam.find({});
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single exam
// @route   GET /api/exams/:id
// @access  Private
const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (exam) {
            res.json(exam);
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a exam
// @route   POST /api/exams
// @access  Private/Admin
const createExam = async (req, res) => {
    try {
        const {
            title,
            subject,
            difficulty,
            duration,
            questions,
            description,
            category,
            passingScore,
            maxAttempts,
            isPublic,
            randomizeQuestions,
            showResults,
            allowReview,
            timeLimit,
            instructions,
            status
        } = req.body;

        const exam = new Exam({
            title: title || 'New Exam',
            subject: subject || 'General',
            difficulty: difficulty || 'Medium',
            duration: duration || 60,
            questions: [], // You might want to handle questions array creation differently
            description,
            category,
            passingScore,
            maxAttempts,
            isPublic,
            randomizeQuestions,
            showResults,
            allowReview,
            timeLimit,
            instructions,
            status: status || 'Draft',
        });

        const createdExam = await exam.save();
        res.status(201).json(createdExam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
const updateExam = async (req, res) => {
    try {
        const {
            title,
            subject,
            difficulty,
            duration,
            questions,
            status,
        } = req.body;

        const exam = await Exam.findById(req.params.id);

        if (exam) {
            exam.title = title || exam.title;
            exam.subject = subject || exam.subject;
            exam.difficulty = difficulty || exam.difficulty;
            exam.duration = duration || exam.duration;
            exam.questions = questions || exam.questions;
            exam.status = status || exam.status;

            const updatedExam = await exam.save();
            res.json(updatedExam);
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (exam) {
            await exam.deleteOne();
            res.json({ message: 'Exam removed' });
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam,
};
