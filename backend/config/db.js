import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.log(`💡 Tip: Ensure MongoDB service is running on ${env.MONGO_URI} or set MONGO_URI in .env`);
  }
};
