const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Config & Middleware
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const initChatSocket = require('./sockets/chatSocket');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const taskRoutes = require('./routes/taskRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  },
});

// Connect Database
connectDB();

// Express Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

// Flexible CORS for production (Vercel / Render / Local)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://projectforage-cyan.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root landing endpoint for browser visitors
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Project Forge API Server</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0f1d; color: #f8fafc; padding: 40px; text-align: center; }
          .card { background: #141e33; border: 1px solid #1e293b; border-radius: 16px; max-width: 500px; margin: 0 auto; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          h1 { color: #38bdf8; margin-bottom: 10px; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
          .badge { background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; display: inline-block; margin-bottom: 20px; }
          a { color: #38bdf8; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">🟢 SERVER ONLINE</span>
          <h1>Project Forge API</h1>
          <p>The backend REST API and Socket.IO server are running successfully on port 5000.</p>
          <p>Access the web application at <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></p>
          <p>API Endpoint Index: <a href="/api">http://localhost:5000/api</a></p>
        </div>
      </body>
    </html>
  `);
});

// Root API index endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Project Forge REST API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: ['POST /api/auth/login', 'POST /api/auth/register', 'GET /api/auth/me'],
      projects: ['GET /api/projects', 'POST /api/projects', 'GET /api/projects/:id'],
      users: ['GET /api/users', 'GET /api/users/:id', 'PUT /api/users/profile'],
      dashboard: 'GET /api/dashboard',
      notifications: 'GET /api/notifications',
      invitations: 'GET /api/invitations',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Project Forge API is running' });
});

// API Routes (supports both /api/* and /* paths for Vercel serverless functions)
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

// Error Handler Middleware
app.use(errorHandler);

// Socket.IO Logic
initChatSocket(io);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Project Forge Server running on port ${PORT}`);
  });
}

module.exports = app;
