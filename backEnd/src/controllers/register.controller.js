import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// Register User (User Role by Default)
export const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    
    // Role can be 'user' or 'admin' (default to 'user' if not provided)
    const userRole = role === 'admin' ? 'admin' : 'user';
    
    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            role: userRole
        });

        // Save the user
        await newUser.save();

        // Generate a token for the user
        const token = generateToken(newUser);

        // Send response with the token
        res.status(201).json({ message: 'User registered successfully.', token });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Login User (User and Admin)
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password.' });
        }

        // Generate a token for the user
        const token = generateToken(user);

        // Send response with the token
        res.json({ message: 'Login successful.', token });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};
