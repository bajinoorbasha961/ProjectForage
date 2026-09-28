const mongoose = require('mongoose');

const autoSeedCheck = async () => {
  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Empty database detected! Auto-seeding initial demo data...');
      const { seedData } = require('../utils/seed');
      await seedData();
    }
  } catch (err) {
    console.warn(`Auto-seed check notice: ${err.message}`);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      'mongodb+srv://bajinoorbasha961_db_user:RcbSpbjPQbndNErQ@cluster0.eoixpnk.mongodb.net/project_forge?retryWrites=true&w=majority&appName=Cluster0';
    const localUri = 'mongodb://127.0.0.1:27017/project_forge';
    let conn;
    
    // 1. Try primary MONGO_URI if provided in environment
    if (mongoUri) {
      try {
        conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await autoSeedCheck();
        return conn;
      } catch (err) {
        console.warn(`Could not connect to primary MONGO_URI: ${err.message}`);
      }
    }

    // 2. Try local MongoDB instance (useful for local development)
    try {
      conn = await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
      await autoSeedCheck();
      return conn;
    } catch (err) {
      console.warn(`Could not connect to local MongoDB (${localUri}): ${err.message}`);
    }

    // 3. Fallback to MongoMemoryServer only for local dev/testing
    if (process.env.NODE_ENV !== 'production') {
      console.log('Starting MongoMemoryServer fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      conn = await mongoose.connect(uri);
      console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
      await autoSeedCheck();
      return conn;
    } else {
      throw new Error('MONGO_URI is missing or unreachable in production environment.');
    }
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};

module.exports = connectDB;
