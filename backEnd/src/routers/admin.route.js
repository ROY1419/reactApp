import express from 'express';
import User from '../models/User.js';
import authenticate from '../middlewares/auth.middlewares.js';

const router = express.Router();

// Get All Users (Admin Only)
router.get('/', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    try {
        const users = await User.find({}, '-password'); // Exclude passwords from the response
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// Get Single User by ID (Admin Only)
router.get('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    try {
        const user = await User.findById(req.params.id, '-password'); // Exclude password
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// Update User by ID (Admin Only)
router.put('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { username, role } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, role },
            { new: true, runValidators: true, fields: '-password' }
        );
        if (!updatedUser) return res.status(404).json({ error: 'User not found.' });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// Delete User by ID (Admin Only)
router.delete('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

export default router;
