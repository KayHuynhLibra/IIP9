import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.error('MongoDB URI is not defined in environment variables');
      throw new Error('MongoDB URI is not defined');
    }

    // Configure mongoose
    mongoose.set('strictQuery', false);
    
    // Set connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    // Attempt to connect
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Log successful connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during mongoose connection closure:', err);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('Database connection error:', err);
    // Log detailed error information
    if (err.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Please check:');
      console.error('1. MongoDB server is running');
      console.error('2. MongoDB URI is correct');
      console.error('3. Network connectivity');
      console.error('4. Firewall settings');
    }
    process.exit(1);
  }
};

export default connectDB;