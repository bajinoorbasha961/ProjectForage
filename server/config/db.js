const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const localUri = 'mongodb://127.0.0.1:27017/project_forge';
    
    if (mongoUri) {
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`MongoDB Connected (Primary): ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn(`Could not connect to primary MONGO_URI: ${err.message}`);
      }
    }

    try {
      const conn = await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`Could not connect to local MongoDB (${localUri}): ${err.message}`);
      console.log('Starting MongoMemoryServer fallback...');
      
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
      return conn;
    }
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
