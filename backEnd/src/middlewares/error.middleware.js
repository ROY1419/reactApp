export const errorHandler = (err, req, res, next) => {
    if (err.code === 11000) {
        res.status(400).json({ message: 'Duplicate key error', error: err.keyValue });
    } else {
        res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
    }
};