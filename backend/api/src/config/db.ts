import mongoose from 'mongoose';
import { env } from './env.config';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error}`);
    // Non-fatal for now to allow health checks without local mongo
  }
};
