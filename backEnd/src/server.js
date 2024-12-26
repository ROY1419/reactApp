import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routers/auth.route.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect("mongodb+srv://royshubham471:KiPhYArWGw47VGIp@cluster0.f1x7q.mongodb.net")
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log('Database connection error', err);
    });

// Start the server
const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


