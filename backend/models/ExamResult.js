const mongoose = require('mongoose');

const examResultSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Exam',
        },
        examTitle: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            default: 0,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        correctAnswers: {
            type: Number,
            required: true,
            default: 0,
        },
        timeTaken: {
            type: String,
            default: '0h 0m',
        },
        duration: {
            type: Number, // in minutes
            default: 0,
        },
        status: {
            type: String,
            enum: ['completed', 'incomplete', 'abandoned'],
            default: 'incomplete',
        },
        answers: [{
            questionId: String,
            selectedAnswer: Number,
            isCorrect: Boolean,
        }],
        startedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
examResultSchema.index({ user: 1, createdAt: -1 });
examResultSchema.index({ exam: 1 });

const ExamResult = mongoose.model('ExamResult', examResultSchema);

module.exports = ExamResult;
