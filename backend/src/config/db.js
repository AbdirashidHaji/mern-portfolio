import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from DB');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('⚠️  MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    
    // Check if it's a connection string issue
    if (error.message.includes('Invalid connection string')) {
      console.error('🔧 Please check your MONGODB_URI in .env file');
      console.error('Current URI starts with:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    }
    
    process.exit(1);
  }
};

export default connectDB;