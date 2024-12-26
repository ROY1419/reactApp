import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username: username, password: hashedPassword, role });
        if (!newUser.username) {
            throw new Error('Username is required');
        }
        const existingUser = await User.findOne({ username: newUser.username });
        if (existingUser) {
            throw new Error('Username already taken');
        }
        res.status(201).send('User registered successfully');
        await newUser.save();
    } catch (error) {
        if (error.code === 11000) {
            console.error('Duplicate key error:', error.message);
        } else {
            console.error('Error:', error.message);
        }

    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(403).send('Invalid credentials');
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
});

export default router;