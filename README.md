# Project Forge — Build Ideas. Find Teammates. Forge Projects.

Project Forge is a production-quality collaborative web application for university students to post project ideas, form cross-departmental project teams based on skill matching, organize work via Kanban boards and milestone timelines, discuss technical decisions, and communicate in real-time.

---

## 🌟 Key Features

1. **User Authentication & Profiles**
   - JWT authentication with bcrypt password hashing.
   - Rich student profile with university, department, year, bio, skills badges, GitHub, LinkedIn, and portfolio links.

2. **Project Ideas & Discovery**
   - Public & authenticated project discovery gallery.
   - Search & filter by category (Web Dev, AI/ML, Mobile, Blockchain, IoT, Game Dev, etc.), difficulty, status, and required skills.

3. **Skill-Based Teammate Matching**
   - Automated percentage match score algorithm comparing project skill requirements with student profile skills.
   - Direct team invitation workflow and join requests.

4. **Interactive Kanban Task Board**
   - 4-column Kanban workflow (**TODO**, **IN PROGRESS**, **IN REVIEW**, **COMPLETED**).
   - Priority indicators (**Low**, **Medium**, **High**, **Urgent**), assignees, milestones, and due dates.

5. **Milestone Roadmap Tracking**
   - Project phase management with automated progress calculation based on completed tasks.

6. **Real-Time Team Room Chat**
   - Socket.IO WebSocket chat rooms exclusive to official project members.
   - Message history persistence in MongoDB with sender avatars and timestamps.

7. **Project Discussion Board**
   - Threaded technical discussion topics with author replies and deletion permissions.

8. **Visual Progress Analytics**
   - Recharts graphs displaying task status breakdown, priority metrics, and overall completion rate.

9. **Notifications & Activity Feed**
   - Real-time dropdown notification center with unread count badges.
   - Activity feed logging team actions ("Rahul created task", "Sophia completed milestone", etc.).

---

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router DOM, Axios, Context API, Lucide React, Socket.IO Client, Recharts, React Hot Toast.
- **Backend**: Node.js, Express.js, MongoDB Atlas (with MongoMemoryServer fallback), Mongoose, JSON Web Tokens (JWT), bcryptjs, Socket.IO, Helmet, Cors, Morgan.

---

## 📁 Project Structure

```
Project Forge/
├── client/                      # Frontend Vite React App
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI & Feature components
│   │   │   ├── common/          # Badge, Button, Modal, ProgressBar, Skeleton
│   │   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   │   ├── notifications/   # NotificationDropdown
│   │   │   ├── projects/        # ProjectCard, Filter, Overview/Team/Task/Analytics Tabs
│   │   │   ├── tasks/           # KanbanBoard, TaskCard, TaskModal
│   │   │   └── teammates/       # TeammateCard, MatchScoreBadge
│   │   ├── context/             # AuthContext, SocketContext
│   │   ├── pages/               # Landing, Login, Register, Dashboard, Discover, Details, etc.
│   │   ├── services/            # Axios API Services (Auth, Projects, Users, Tasks)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                      # Backend Express & Socket.IO API
│   ├── config/                  # DB Connection (MongoDB Atlas & Fallback)
│   ├── controllers/             # Auth, User, Project, Task, Milestone, Chat, Notification
│   ├── middleware/              # Auth Middleware & Error Handler
│   ├── models/                  # Mongoose Schemas (User, Project, Task, Milestone, Message, etc.)
│   ├── routes/                  # Express API Routes
│   ├── sockets/                 # Socket.IO Real-time Chat Handlers
│   ├── utils/                   # Database Seed Script
│   ├── server.js
│   └── package.json
│
├── .env.example
├── README.md
└── package.json
```

---

## 🔑 Demo Login Credentials

For quick evaluation and testing, the database includes a pre-seeded student account:

- **Email**: `demo@projectforge.com`
- **Password**: `Demo@12345`

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

In the root directory, install all root, client, and server packages:

```bash
npm run install-all
```

### 2. Configure Environment Variables

Create `.env` in `server/.env` or root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/project_forge
JWT_SECRET=project_forge_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

*(Note: If local MongoDB is not running, the application automatically initializes an embedded `mongodb-memory-server` out-of-the-box!)*

### 3. Seed the Database

Run the database seed script to populate realistic students, projects, tasks, milestones, and chat messages:

```bash
npm run seed
```

### 4. Launch Application

Start both backend server and frontend Vite dev server concurrently:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:5000`

---

## 🔮 Future Improvements

- File upload integration with Cloudinary for project attachments & avatars.
- Integration with GitHub API to sync commits directly into the activity feed.
- Built-in video calling & screen share for remote project meetings.

---

**Built with ❤️ for student builders globally.**
