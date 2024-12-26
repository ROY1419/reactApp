import User from '../models/User.js';

// Add a new user (Admin only)
export const addUser = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { username, password, role } = req.body;

    try {
        const newUser = new User({ username, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Update user role (Admin only)
export const updateUserRole = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true, fields: '-password' }
        );
        if (!updatedUser) return res.status(404).json({ error: 'User not found.' });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// List all users (Admin only)
export const listUsers = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    try {
        const users = await User.find({}, '-password'); // Exclude passwords from the response
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Delete a user (Admin only)
export const deleteUser = async (req, res) => {
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
};
