import mongoose from 'mongoose';

const ExamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [
        {
            text: { type: String, required: true },
            options: { type: [String], required: true },
            correctAnswer: { type: Number, required: true },
        },
    ],
});

const Exam = mongoose.model('Exam', ExamSchema);
export default Exam;
