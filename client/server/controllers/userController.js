const User = require('../models/User');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');

// @desc    Get all users / search users with filters
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res, next) => {
  try {
    const { search, skill, department, college, year } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (skill) {
      const skillsArray = skill.split(',').map((s) => s.trim());
      query.skills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
    }

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    if (college) {
      query.college = { $regex: college, $options: 'i' };
    }

    if (year) {
      query.year = year;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    // Fetch user project counts
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const memberships = await ProjectMember.find({ user: u._id }).populate('project');
        return {
          ...u.toObject(),
          projectCount: memberships.length,
          projects: memberships.map((m) => m.project).filter(Boolean),
        };
      })
    );

    res.json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user projects
    const memberships = await ProjectMember.find({ user: user._id }).populate('project');
    const projects = memberships.map((m) => ({
      ...m.project?.toObject(),
      role: m.role,
    })).filter((p) => p._id);

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      college,
      department,
      year,
      bio,
      skills,
      github,
      linkedin,
      portfolio,
      avatar,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    if (department !== undefined) user.department = department;
    if (year !== undefined) user.year = year;
    if (bio !== undefined) user.bio = bio;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (avatar !== undefined) user.avatar = avatar;

    if (skills) {
      user.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Match teammates for a specific project based on required skills
// @route   GET /api/users/match/:projectId
// @access  Private
exports.getMatchingTeammates = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const currentMembers = await ProjectMember.find({ project: project._id });
    const memberUserIds = currentMembers.map((m) => m.user.toString());

    // Find users not currently on the project
    const candidates = await User.find({ _id: { $nin: memberUserIds } });

    const requiredSkills = project.requiredSkills.map((s) => s.toLowerCase().trim());

    const matchedUsers = candidates.map((user) => {
      const userSkills = user.skills.map((s) => s.toLowerCase().trim());
      
      let matchCount = 0;
      if (requiredSkills.length > 0) {
        requiredSkills.forEach((reqSkill) => {
          if (userSkills.some((uSkill) => uSkill.includes(reqSkill) || reqSkill.includes(uSkill))) {
            matchCount++;
          }
        });
      }

      const matchPercentage = requiredSkills.length > 0
        ? Math.round((matchCount / requiredSkills.length) * 100)
        : 50;

      return {
        ...user.toObject(),
        matchPercentage: Math.min(matchPercentage, 100),
        matchingSkillsCount: matchCount,
      };
    });

    // Sort by match percentage descending
    matchedUsers.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      success: true,
      count: matchedUsers.length,
      data: matchedUsers,
    });
  } catch (error) {
    next(error);
  }
};
