import mongoose from 'mongoose';

const dbCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('Database connection is not ready. Current state:', mongoose.connection.readyState);
    return res.status(503).json({
      message: 'Database connection is not available',
      error: 'Database connection error',
      details: {
        state: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
  }
  next();
};

export default dbCheck; 