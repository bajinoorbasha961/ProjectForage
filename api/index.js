const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../server/config/db');

// Routes
const authRoutes = require('../server/routes/authRoutes');
const userRoutes = require('../server/routes/userRoutes');
const projectRoutes = require('../server/routes/projectRoutes');
const invitationRoutes = require('../server/routes/invitationRoutes');
const taskRoutes = require('../server/routes/taskRoutes');
const milestoneRoutes = require('../server/routes/milestoneRoutes');
const discussionRoutes = require('../server/routes/discussionRoutes');
const chatRoutes = require('../server/routes/chatRoutes');
const notificationRoutes = require('../server/routes/notificationRoutes');
const dashboardRoutes = require('../server/routes/dashboardRoutes');
const errorHandler = require('../server/middleware/error');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

const corsOptions = {
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', message: 'Project Forge API is running on Vercel' });
});

app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/users', '/users'], userRoutes);
app.use(['/api/projects', '/projects'], projectRoutes);
app.use(['/api/invitations', '/invitations'], invitationRoutes);
app.use(['/api/notifications', '/notifications'], notificationRoutes);
app.use(['/api/dashboard', '/dashboard'], dashboardRoutes);
app.use(['/api', '/'], taskRoutes);
app.use(['/api', '/'], milestoneRoutes);
app.use(['/api', '/'], discussionRoutes);
app.use(['/api', '/'], chatRoutes);

app.use(errorHandler);

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('Vercel API DB connection notice:', err.message);
  }
  return app(req, res);
};
