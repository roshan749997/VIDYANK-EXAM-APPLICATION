const ExamResult = require('../models/ExamResult.js');
const Exam = require('../models/Exam.js');

// @desc    Create exam result
// @route   POST /api/exam-results
// @access  Private
const createExamResult = async (req, res) => {
    try {
        const {
            examId,
            examTitle,
            category,
            score,
            totalQuestions,
            correctAnswers,
            timeTaken,
            duration,
            status,
            answers,
        } = req.body;

        const examResult = await ExamResult.create({
            user: req.user._id,
            exam: examId,
            examTitle,
            category,
            score,
            totalQuestions,
            correctAnswers,
            timeTaken,
            duration,
            status,
            answers,
            completedAt: status === 'completed' ? new Date() : null,
        });

        if (status === 'completed') {
            const User = require('../models/User.js');
            await User.findByIdAndUpdate(req.user._id, { $inc: { examsAttempted: 1 } });
        }

        res.status(201).json(examResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all exam results for logged in user
// @route   GET /api/exam-results
// @access  Private
const getUserExamResults = async (req, res) => {
    try {
        const examResults = await ExamResult.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('exam', 'title subject difficulty');

        res.json(examResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single exam result
// @route   GET /api/exam-results/:id
// @access  Private
const getExamResultById = async (req, res) => {
    try {
        const examResult = await ExamResult.findById(req.params.id)
            .populate('exam', 'title subject difficulty')
            .populate('user', 'firstName lastName email');

        if (!examResult) {
            return res.status(404).json({ message: 'Exam result not found' });
        }

        // Check if user owns this result
        if (examResult.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this result' });
        }

        res.json(examResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update exam result
// @route   PUT /api/exam-results/:id
// @access  Private
const updateExamResult = async (req, res) => {
    try {
        const examResult = await ExamResult.findById(req.params.id);

        if (!examResult) {
            return res.status(404).json({ message: 'Exam result not found' });
        }

        // Check if user owns this result
        if (examResult.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this result' });
        }

        const updatedResult = await ExamResult.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                completedAt: req.body.status === 'completed' ? new Date() : examResult.completedAt,
            },
            { new: true }
        );

        res.json(updatedResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete exam result
// @route   DELETE /api/exam-results/:id
// @access  Private
const deleteExamResult = async (req, res) => {
    try {
        const examResult = await ExamResult.findById(req.params.id);

        if (!examResult) {
            return res.status(404).json({ message: 'Exam result not found' });
        }

        // Check if user owns this result
        if (examResult.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this result' });
        }

        await examResult.deleteOne();
        res.json({ message: 'Exam result deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user performance statistics
// @route   GET /api/exam-results/stats/performance
// @access  Private
const getUserPerformanceStats = async (req, res) => {
    try {
        const examResults = await ExamResult.find({ user: req.user._id, status: 'completed' });

        if (examResults.length === 0) {
            return res.json({
                averageScore: 0,
                bestSubject: 'N/A',
                worstSubject: 'N/A',
                totalTests: 0,
                totalHours: 0,
                subjects: [],
            });
        }

        // Calculate average score
        const averageScore = Math.round(
            examResults.reduce((sum, result) => sum + (result.score || 0), 0) / examResults.length
        );

        // Calculate subject performance
        const subjectMap = {};
        examResults.forEach((result) => {
            const subject = result.category || 'General';
            if (!subjectMap[subject]) {
                subjectMap[subject] = { total: 0, correct: 0, count: 0 };
            }
            subjectMap[subject].total += result.totalQuestions || 0;
            subjectMap[subject].correct += result.correctAnswers || 0;
            subjectMap[subject].count += 1;
        });

        const subjects = Object.entries(subjectMap)
            .map(([name, data]) => {
                const progress = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return { name, progress, count: data.count };
            })
            .sort((a, b) => b.progress - a.progress);

        const bestSubject = subjects.length > 0 ? subjects[0].name : 'N/A';
        const worstSubject = subjects.length > 0 ? subjects[subjects.length - 1].name : 'N/A';

        // Calculate total hours
        const totalMinutes = examResults.reduce((sum, result) => {
            return sum + (result.duration || 0);
        }, 0);
        const totalHours = Math.round(totalMinutes / 60);

        res.json({
            averageScore,
            bestSubject,
            worstSubject,
            totalTests: examResults.length,
            totalHours,
            subjects: subjects.slice(0, 5), // Top 5 subjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user progress data
// @route   GET /api/exam-results/stats/progress
// @access  Private
const getUserProgress = async (req, res) => {
    try {
        const examResults = await ExamResult.find({ user: req.user._id });

        if (examResults.length === 0) {
            return res.json([]);
        }

        // Calculate progress by subject/category
        const subjectMap = {};
        examResults.forEach((result) => {
            const subject = result.category || 'General';
            if (!subjectMap[subject]) {
                subjectMap[subject] = { completed: 0, total: 0 };
            }
            if (result.status === 'completed' && result.score > 0) {
                subjectMap[subject].completed += 1;
            }
            subjectMap[subject].total += 1;
        });

        const progress = Object.entries(subjectMap)
            .map(([subject, data]) => ({
                subject,
                completed: data.completed,
                total: data.total,
                percent: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
            }))
            .sort((a, b) => b.percent - a.percent);

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get leaderboard (top performers)
// @route   GET /api/exam-results/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    try {
        const { examId, period = 'all' } = req.query;

        let dateFilter = {};
        const now = new Date();

        // Apply time period filter
        if (period === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFilter = { createdAt: { $gte: weekAgo } };
        } else if (period === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateFilter = { createdAt: { $gte: monthAgo } };
        }

        let matchFilter = { status: 'completed', ...dateFilter };
        if (examId) {
            matchFilter.exam = examId;
        }

        // Aggregate to get top performers
        const leaderboard = await ExamResult.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$score' },
                    averageScore: { $avg: '$score' },
                    totalExams: { $sum: 1 },
                    bestScore: { $max: '$score' },
                }
            },
            { $sort: { averageScore: -1, totalExams: -1 } },
            { $limit: 50 }, // Top 50
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 1,
                    name: {
                        $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName']
                    },
                    city: '$userInfo.city',
                    totalScore: 1,
                    averageScore: { $round: ['$averageScore', 2] },
                    totalExams: 1,
                    bestScore: 1,
                }
            }
        ]);

        // Add rank
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));

        res.json(rankedLeaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExamResult,
    getUserExamResults,
    getExamResultById,
    updateExamResult,
    deleteExamResult,
    getUserPerformanceStats,
    getUserProgress,
    getLeaderboard,
};
