import express from 'express';
import authenticate from '../middlewares/auth.middlewares.js';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

// Get Student Profile (Student Only)
router.get('/profile', authenticate, studentController.getStudentProfile);

// Update Student Profile (Student Only)
router.put('/profile', authenticate, studentController.updateStudentProfile);

// Change Student Password (Student Only)
router.put('/change-password', authenticate, studentController.changePassword);

export default router;
