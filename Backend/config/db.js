const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false); 
    await mongoose.connect(process.env.MONGODB_URI|| 'mongodb://localhost:27017/budget-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;