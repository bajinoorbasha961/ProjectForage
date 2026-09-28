const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../server/config/db');
const app = require('../server/server');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Vercel API DB connection error:', err);
  }
  return app(req, res);
};
