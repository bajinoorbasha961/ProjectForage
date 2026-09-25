const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_forge';
    
    // Attempt connection to specified MONGO_URI with short timeout to detect offline local server
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`Could not connect to primary MONGO_URI (${mongoUri}): ${err.message}`);
      console.log('Starting MongoMemoryServer fallback for seamless out-of-the-box operation...');
      
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
