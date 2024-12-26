import User from '../models/user.model';
// Get the student’s profile (Student Only)
export const getStudentProfile = async (req, res) => {
    try {
        const student = await User.findById(req.user._id, '-password'); // Exclude password
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Update student’s profile (Student Only)
export const updateStudentProfile = async (req, res) => {
    const { username } = req.body; // Assuming the student can only update their username
    
    try {
        const updatedStudent = await User.findByIdAndUpdate(
            req.user._id,
            { username },
            { new: true, runValidators: true, fields: '-password' } // Don't update password
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

// Change student’s password (Student Only)
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Please provide both old and new passwords.' });
    }

    try {
        const student = await User.findById(req.user._id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        // Check if the old password matches
        const isMatch = await student.comparePassword(oldPassword); // Assuming comparePassword is defined in your User model
        if (!isMatch) {
            return res.status(400).json({ error: 'Old password is incorrect.' });
        }

        // Update password
        student.password = newPassword;
        await student.save();
        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
};

