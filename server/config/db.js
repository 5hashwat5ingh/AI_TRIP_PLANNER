const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-travelops';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout so fallback can engage smoothly if local mongo is not running
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] MongoDB connection failed (${error.message}). Running with high-performance In-Memory Data Store.`);
    return false;
  }
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };
