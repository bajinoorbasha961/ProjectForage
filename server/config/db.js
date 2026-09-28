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

  const mongoUri =
    process.env.MONGO_URI ||
    'mongodb+srv://bajinoorbasha961_db_user:RcbSpbjPQbndNErQ@cluster0.eoixpnk.mongodb.net/project_forge?retryWrites=true&w=majority&appName=Cluster0';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await autoSeedCheck();
    return conn;
  } catch (err) {
    console.warn(`Primary MONGO_URI connection notice: ${err.message}`);
  }

  // Local & Memory Server fallbacks for development only
  if (process.env.NODE_ENV !== 'production') {
    try {
      const localUri = 'mongodb://127.0.0.1:27017/project_forge';
      const conn = await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
      await autoSeedCheck();
      return conn;
    } catch (err) {
      console.warn(`Local MongoDB notice: ${err.message}`);
    }

    try {
      console.log('Starting MongoMemoryServer fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
      await autoSeedCheck();
      return conn;
    } catch (err) {
      console.warn(`MongoMemoryServer fallback notice: ${err.message}`);
    }
  }
};

module.exports = connectDB;
