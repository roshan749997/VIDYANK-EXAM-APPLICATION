const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: Number, required: true }, // Index of the correct option
});

const examSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            required: true,
        },
        duration: {
            type: Number, // in minutes
            required: true,
        },
        questions: [questionSchema],
        status: {
            type: String,
            enum: ['Active', 'Draft', 'Archived'],
            default: 'Draft',
        },
        totalQuestions: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

examSchema.pre('save', function (next) {
    if (this.questions) {
        this.totalQuestions = this.questions.length;
    }
    next();
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
