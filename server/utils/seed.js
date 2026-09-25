const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config({ path: '../.env' });

// Models
const User = require('../models/User');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const DiscussionPost = require('../models/DiscussionPost');
const DiscussionReply = require('../models/DiscussionReply');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const JoinRequest = require('../models/JoinRequest');
const Invitation = require('../models/Invitation');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing database...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await ProjectMember.deleteMany({});
    await Milestone.deleteMany({});
    await Task.deleteMany({});
    await DiscussionPost.deleteMany({});
    await DiscussionReply.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    await Activity.deleteMany({});
    await JoinRequest.deleteMany({});
    await Invitation.deleteMany({});

    console.log('🌱 Seeding users...');
    const defaultPassword = await bcrypt.hash('Demo@12345', 10);

    const usersData = [
      {
        name: 'Rahul Sharma',
        email: 'demo@projectforge.com',
        password: defaultPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
        college: 'Stanford University',
        department: 'Computer Science',
        year: '4th Year',
        bio: 'Full-stack web developer passionate about React, Node.js, and building high-impact student projects.',
        skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'TypeScript', 'Socket.IO'],
        github: 'https://github.com/rahulsharma',
        linkedin: 'https://linkedin.com/in/rahulsharma',
        portfolio: 'https://rahulsharma.dev',
      },
      {
        name: 'Priya Patel',
        email: 'priya@projectforge.com',
        password: defaultPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        college: 'MIT',
        department: 'Artificial Intelligence',
        year: '3rd Year',
        bio: 'AI/ML enthusiast working on PyTorch model optimization and NLP applications.',
        skills: ['Python', 'PyTorch', 'Machine Learning', 'Data Science', 'TensorFlow', 'FastAPI'],
        github: 'https://github.com/priyapatel',
        linkedin: 'https://linkedin.com/in/priyapatel',
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@projectforge.com',
        password: defaultPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
        college: 'UC Berkeley',
        department: 'Electrical Engineering & CS',
        year: '4th Year',
        bio: 'Mobile App Specialist & UI/UX perfectionist. Flutter & React Native developer.',
        skills: ['React Native', 'Flutter', 'UI/UX', 'Figma', 'JavaScript', 'Firebase'],
        github: 'https://github.com/arjunmehta',
        linkedin: 'https://linkedin.com/in/arjunmehta',
      },
      {
        name: 'Sophia Chen',
        email: 'sophia@projectforge.com',
        password: defaultPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
        college: 'Carnegie Mellon',
        department: 'Software Engineering',
        year: '3rd Year',
        bio: 'Backend & Cloud Infrastructure specialist. Kubernetes, Docker, and Go enthusiast.',
        skills: ['Go', 'Docker', 'Kubernetes', 'AWS', 'Node.js', 'PostgreSQL'],
        github: 'https://github.com/sophiachen',
        linkedin: 'https://linkedin.com/in/sophiachen',
      },
      {
        name: 'Vikram Verma',
        email: 'vikram@projectforge.com',
        password: defaultPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
        college: 'Georgia Tech',
        department: 'Cybersecurity',
        year: '4th Year',
        bio: 'Ethical hacker and Web3 developer building decentralized identity applications.',
        skills: ['Solidity', 'Blockchain', 'Cybersecurity', 'Web3.js', 'Python', 'Ethereum'],
        github: 'https://github.com/vikramverma',
        linkedin: 'https://linkedin.com/in/vikramverma',
      },
      {
        name: 'Ananya Gupta',
        email: 'ananya@projectforge.com',
        password: defaultPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
        college: 'Columbia University',
        department: 'Design & Media',
        year: '2nd Year',
        bio: 'UI/UX designer focused on modern dark mode aesthetic & user research.',
        skills: ['UI/UX', 'Figma', 'Design Systems', 'CSS', 'User Research', 'Prototyping'],
        github: 'https://github.com/ananyagupta',
        linkedin: 'https://linkedin.com/in/ananyagupta',
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@projectforge.com',
        password: defaultPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        college: 'Harvard University',
        department: 'Computer Science',
        year: '3rd Year',
        bio: 'Game developer and 3D graphic programmer working with Unity & C#.',
        skills: ['C#', 'Unity', 'Game Development', '3D Graphics', 'C++', 'Shader Programming'],
        github: 'https://github.com/marcusvance',
        linkedin: 'https://linkedin.com/in/marcusvance',
      },
      {
        name: 'Kavya Nair',
        email: 'kavya@projectforge.com',
        password: defaultPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya',
        college: 'UT Austin',
        department: 'Data Science',
        year: '2nd Year',
        bio: 'Data visualization and statistical analytics junkie. Loves Pandas & D3.js.',
        skills: ['Python', 'Data Science', 'Pandas', 'D3.js', 'SQL', 'R'],
        github: 'https://github.com/kavyanair',
        linkedin: 'https://linkedin.com/in/kavyanair',
      },
    ];

    const users = await User.insertMany(usersData);
    const [rahul, priya, arjun, sophia, vikram, ananya, marcus, kavya] = users;

    console.log('🚀 Seeding projects...');
    const projectsData = [
      {
        title: 'Project Forge Platform',
        shortDescription: 'Collaborative student project showcase and teammate matching platform.',
        description:
          'Project Forge allows students across universities to share project ideas, form cross-departmental teams based on skill scores, track milestones with Kanban boards, and collaborate in real-time.',
        category: 'Web Development',
        difficulty: 'Advanced',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'Socket.IO', 'Tailwind CSS', 'UI/UX'],
        teamSize: 5,
        duration: '2 Months',
        owner: rahul._id,
        status: 'In Progress',
        repositoryUrl: 'https://github.com/rahulsharma/project-forge',
        demoUrl: 'https://projectforge.dev',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        lookingForTeammates: true,
      },
      {
        title: 'MediVision AI Health Assistant',
        shortDescription: 'AI-powered medical image analysis & diagnostic assistant for medical students.',
        description:
          'A deep learning model trained on chest X-Rays and skin lesion datasets to assist medical students and healthcare professionals with early symptom triage.',
        category: 'AI/ML',
        difficulty: 'Advanced',
        requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'FastAPI', 'React'],
        teamSize: 4,
        duration: '3 Months',
        owner: priya._id,
        status: 'In Progress',
        repositoryUrl: 'https://github.com/priyapatel/medivision-ai',
        demoUrl: 'https://medivision.ai',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        lookingForTeammates: true,
      },
      {
        title: 'CampusPulse Mobile Event App',
        shortDescription: 'Real-time university campus event aggregator and navigation map.',
        description:
          'CampusPulse helps college students discover hackathons, club meetings, and campus events with live interactive maps and instant RSVP notifications.',
        category: 'Mobile Development',
        difficulty: 'Intermediate',
        requiredSkills: ['React Native', 'Firebase', 'UI/UX', 'Figma'],
        teamSize: 3,
        duration: '1-2 Months',
        owner: arjun._id,
        status: 'Planning',
        repositoryUrl: 'https://github.com/arjunmehta/campuspulse',
        demoUrl: '',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
        lookingForTeammates: true,
      },
      {
        title: 'EduChain Decentralized Credentials',
        shortDescription: 'Blockchain-backed academic certificate verification system.',
        description:
          'Issue tamper-proof digital degree certificates and diplomas on Ethereum testnet with instant verification QR codes.',
        category: 'Blockchain',
        difficulty: 'Advanced',
        requiredSkills: ['Solidity', 'Blockchain', 'Web3.js', 'React', 'Cybersecurity'],
        teamSize: 4,
        duration: '3 Months',
        owner: vikram._id,
        status: 'In Progress',
        repositoryUrl: 'https://github.com/vikramverma/educhain',
        demoUrl: '',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
        lookingForTeammates: true,
      },
      {
        title: 'EcoSense Smart Campus IoT',
        shortDescription: 'IoT sensor network for monitoring campus energy consumption and indoor air quality.',
        description:
          'Deploys ESP32 sensor modules connected to an automated Grafana dashboard to track temperature, CO2 levels, and power consumption.',
        category: 'IoT',
        difficulty: 'Intermediate',
        requiredSkills: ['Python', 'Docker', 'AWS', 'Data Science'],
        teamSize: 3,
        duration: '2 Months',
        owner: sophia._id,
        status: 'Planning',
        repositoryUrl: '',
        demoUrl: '',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        lookingForTeammates: true,
      },
      {
        title: 'PixelRealm 2D Metroidvania',
        shortDescription: 'Charming retro pixel-art RPG game created in Unity.',
        description:
          'Explore an intricate underground realm with dynamic lighting, custom boss battles, and a original retro soundtrack.',
        category: 'Game Development',
        difficulty: 'Intermediate',
        requiredSkills: ['C#', 'Unity', 'Game Development', 'UI/UX'],
        teamSize: 4,
        duration: '4 Months',
        owner: marcus._id,
        status: 'In Progress',
        repositoryUrl: 'https://github.com/marcusvance/pixelrealm',
        demoUrl: 'https://itch.io/pixelrealm',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        lookingForTeammates: false,
      },
    ];

    const projects = await Project.insertMany(projectsData);
    const [forgeProj, medivisionProj, campuspulseProj, educhainProj, ecosenseProj, pixelrealmProj] = projects;

    console.log('👥 Adding team members...');
    const membersData = [
      // Project Forge Team
      { project: forgeProj._id, user: rahul._id, role: 'Project Owner' },
      { project: forgeProj._id, user: priya._id, role: 'Team Lead' },
      { project: forgeProj._id, user: ananya._id, role: 'Designer' },
      { project: forgeProj._id, user: sophia._id, role: 'Developer' },

      // MediVision Team
      { project: medivisionProj._id, user: priya._id, role: 'Project Owner' },
      { project: medivisionProj._id, user: rahul._id, role: 'Developer' },
      { project: medivisionProj._id, user: kavya._id, role: 'Researcher' },

      // CampusPulse Team
      { project: campuspulseProj._id, user: arjun._id, role: 'Project Owner' },
      { project: campuspulseProj._id, user: ananya._id, role: 'Designer' },

      // EduChain Team
      { project: educhainProj._id, user: vikram._id, role: 'Project Owner' },
      { project: educhainProj._id, user: sophia._id, role: 'Developer' },

      // EcoSense Team
      { project: ecosenseProj._id, user: sophia._id, role: 'Project Owner' },

      // PixelRealm Team
      { project: pixelrealmProj._id, user: marcus._id, role: 'Project Owner' },
      { project: pixelrealmProj._id, user: arjun._id, role: 'Developer' },
    ];

    await ProjectMember.insertMany(membersData);

    console.log('🎯 Creating milestones...');
    const milestonesData = [
      {
        project: forgeProj._id,
        title: 'Milestone 1: Project Setup & Auth Architecture',
        description: 'Establish repository structure, MongoDB schemas, and JWT authentication flow.',
        startDate: new Date('2026-09-01'),
        dueDate: new Date('2026-09-15'),
        status: 'Completed',
      },
      {
        project: forgeProj._id,
        title: 'Milestone 2: UI Design & Design System',
        description: 'Build responsive Tailwind CSS design tokens, cards, and modal components.',
        startDate: new Date('2026-09-16'),
        dueDate: new Date('2026-09-30'),
        status: 'In Progress',
      },
      {
        project: forgeProj._id,
        title: 'Milestone 3: Teammate Matching & Invitations',
        description: 'Skill matching algorithm and real-time notification engine.',
        startDate: new Date('2026-10-01'),
        dueDate: new Date('2026-10-15'),
        status: 'Not Started',
      },
      {
        project: medivisionProj._id,
        title: 'Milestone 1: Dataset Preprocessing & Cleaning',
        description: 'Augment 10,000 chest X-Ray images with bounding box annotations.',
        startDate: new Date('2026-08-15'),
        dueDate: new Date('2026-09-01'),
        status: 'Completed',
      },
      {
        project: medivisionProj._id,
        title: 'Milestone 2: Model Architecture & Training',
        description: 'Train ResNet-50 backbone with binary classification head.',
        startDate: new Date('2026-09-02'),
        dueDate: new Date('2026-10-01'),
        status: 'In Progress',
      },
    ];

    const milestones = await Milestone.insertMany(milestonesData);

    console.log('📋 Creating tasks...');
    const tasksData = [
      // Forge Project Tasks
      {
        project: forgeProj._id,
        milestone: milestones[0]._id,
        title: 'Design MongoDB Schemas & Indexing',
        description: 'Create Mongoose models for User, Project, Task, Milestone, and Notification.',
        assignedTo: rahul._id,
        createdBy: rahul._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date('2026-09-10'),
      },
      {
        project: forgeProj._id,
        milestone: milestones[0]._id,
        title: 'Implement JWT Authentication Controller',
        description: 'Build register, login, and token refresh endpoints with bcrypt hashing.',
        assignedTo: sophia._id,
        createdBy: rahul._id,
        priority: 'Urgent',
        status: 'Completed',
        dueDate: new Date('2026-09-12'),
      },
      {
        project: forgeProj._id,
        milestone: milestones[1]._id,
        title: 'Build Interactive Kanban Task Board',
        description: 'Implement drag and drop support and column filtering for task status changes.',
        assignedTo: rahul._id,
        createdBy: rahul._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date('2026-09-28'),
      },
      {
        project: forgeProj._id,
        milestone: milestones[1]._id,
        title: 'Create Dashboard & Progress Charts',
        description: 'Integrate Recharts to show project completion percentage and pending task counts.',
        assignedTo: ananya._id,
        createdBy: priya._id,
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date('2026-09-29'),
      },
      {
        project: forgeProj._id,
        milestone: milestones[2]._id,
        title: 'Skill-Based Teammate Matching Algorithm',
        description: 'Calculate matching score percentage between required project skills and candidate student skills.',
        assignedTo: priya._id,
        createdBy: rahul._id,
        priority: 'High',
        status: 'Todo',
        dueDate: new Date('2026-10-05'),
      },
      {
        project: forgeProj._id,
        milestone: milestones[2]._id,
        title: 'Real-time Team Room Socket.IO Chat',
        description: 'Implement WebSocket connections for project room messaging and unread notification indicators.',
        assignedTo: rahul._id,
        createdBy: rahul._id,
        priority: 'Urgent',
        status: 'Review',
        dueDate: new Date('2026-10-08'),
      },

      // MediVision Tasks
      {
        project: medivisionProj._id,
        milestone: milestones[3]._id,
        title: 'Download NIH Chest X-Ray Dataset',
        description: 'Setup AWS S3 bucket and download images with clinical metadata.',
        assignedTo: kavya._id,
        createdBy: priya._id,
        priority: 'Medium',
        status: 'Completed',
        dueDate: new Date('2026-08-25'),
      },
      {
        project: medivisionProj._id,
        milestone: milestones[4]._id,
        title: 'Build FastAPI Model Inference Server',
        description: 'Expose REST endpoint returning bounding boxes and diagnosis confidence scores.',
        assignedTo: rahul._id,
        createdBy: priya._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date('2026-09-25'),
      },
    ];

    const tasks = await Task.insertMany(tasksData);

    console.log('💬 Creating discussions...');
    const posts = await DiscussionPost.insertMany([
      {
        project: forgeProj._id,
        author: rahul._id,
        title: 'Which State Management Library Should We Use?',
        content:
          'Hey team! Should we rely on React Context API or adopt Zustand for client-side state management? Context is native, but Zustand simplifies state updates for real-time notifications.',
      },
      {
        project: forgeProj._id,
        author: ananya._id,
        title: 'Design System & Dark Mode Palette Proposal',
        content:
          'I have published the Figma UI draft. We are using Slate 950 background with Brand Blue (#0c8ee9) accents for high contrast accessible UI.',
      },
    ]);

    await DiscussionReply.insertMany([
      {
        post: posts[0]._id,
        author: sophia._id,
        content: 'I vote for Context API combined with custom hooks! It keeps our dependencies minimal and ultra lightweight.',
      },
      {
        post: posts[0]._id,
        author: priya._id,
        content: 'Agreed! Context API with lightweight custom state hooks works wonderfully for our app size.',
      },
      {
        post: posts[1]._id,
        author: rahul._id,
        content: 'The Figma designs look incredible Ananya! Love the rounded cards and subtle hover micro-animations.',
      },
    ]);

    console.log('💬 Creating real-time chat messages...');
    await Message.insertMany([
      {
        project: forgeProj._id,
        sender: rahul._id,
        content: 'Welcome to the Project Forge core team chat! 👋',
      },
      {
        project: forgeProj._id,
        sender: priya._id,
        content: 'Excited to build this platform! The database schemas are ready.',
      },
      {
        project: forgeProj._id,
        sender: ananya._id,
        content: 'I uploaded the card layout components and badge icons to the repo!',
      },
      {
        project: forgeProj._id,
        sender: sophia._id,
        content: 'JWT auth endpoints are fully functional and tested!',
      },
    ]);

    console.log('🔔 Creating notifications & activity feed...');
    await Notification.insertMany([
      {
        recipient: rahul._id,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: 'You were assigned task "Build Interactive Kanban Task Board"',
        relatedProject: forgeProj._id,
        relatedTask: tasks[2]._id,
        read: false,
      },
      {
        recipient: rahul._id,
        type: 'MEMBER_JOINED',
        title: 'New Teammate Joined',
        message: 'Sophia Chen joined "Project Forge Platform"',
        relatedProject: forgeProj._id,
        read: true,
      },
      {
        recipient: priya._id,
        type: 'TASK_ASSIGNED',
        title: 'Task Assigned',
        message: 'You were assigned task "Skill-Based Teammate Matching Algorithm"',
        relatedProject: forgeProj._id,
        relatedTask: tasks[4]._id,
        read: false,
      },
    ]);

    await Activity.insertMany([
      {
        project: forgeProj._id,
        user: rahul._id,
        action: 'created the project "Project Forge Platform"',
      },
      {
        project: forgeProj._id,
        user: sophia._id,
        action: 'completed task "Implement JWT Authentication Controller"',
      },
      {
        project: forgeProj._id,
        user: ananya._id,
        action: 'joined the team',
      },
      {
        project: forgeProj._id,
        user: rahul._id,
        action: 'completed task "Design MongoDB Schemas & Indexing"',
      },
    ]);

    console.log('✅ Database successfully seeded!');
    console.log('🔑 DEMO LOGIN CREDENTIALS:');
    console.log('Email: demo@projectforge.com');
    console.log('Password: Demo@12345');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
