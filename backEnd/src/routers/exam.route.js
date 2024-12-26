import express from 'express';
import Exam from '../models/exam.model.js';
import authenticate from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    const { title, questions } = req.body;
    const exam = new Exam({ title, questions });
    await exam.save();
    res.status(201).send('Exam created successfully');
});

router.get('/', authenticate, async (req, res) => {
    const exams = await Exam.find();
    res.json(exams);
});

router.post('/:id/submit', authenticate, async (req, res) => {
    const { answers } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).send('Exam not found');
    let score = 0;
    exam.questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) score++;
    });
    const result = {
        score,
        passed: score >= Math.ceil(exam.questions.length / 2),
    };
    res.json(result);
});

export default router;