import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
  try {
    // Use remote MongoDB (Atlas) if available, otherwise use local
    const mongoUri = ENV.MONGO_URI;

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
