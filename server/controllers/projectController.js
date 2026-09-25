const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const JoinRequest = require('../models/JoinRequest');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// Helper to compute progress
const calculateProjectProgress = async (projectId) => {
  const tasks = await Task.find({ project: projectId });
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
};

// @desc    Get all projects with search and filters
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const { search, category, skill, difficulty, status, lookingForTeammates } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (lookingForTeammates === 'true') {
      query.lookingForTeammates = true;
    }

    if (skill) {
      const skillsArray = skill.split(',').map((s) => s.trim());
      query.requiredSkills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name avatar email college department')
      .sort({ createdAt: -1 });

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const members = await ProjectMember.find({ project: project._id }).populate(
          'user',
          'name avatar college department skills'
        );
        const progress = await calculateProjectProgress(project._id);

        return {
          ...project.toObject(),
          currentMemberCount: members.length,
          members,
          progress,
        };
      })
    );

    res.json({
      success: true,
      count: projectsWithDetails.length,
      data: projectsWithDetails,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      difficulty,
      requiredSkills,
      teamSize,
      duration,
      repositoryUrl,
      demoUrl,
      image,
      lookingForTeammates,
    } = req.body;

    if (!title || !shortDescription || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project title, short description, and category',
      });
    }

    const processedSkills = Array.isArray(requiredSkills)
      ? requiredSkills
      : typeof requiredSkills === 'string'
      ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const project = await Project.create({
      title,
      shortDescription,
      description: description || '',
      category,
      difficulty: difficulty || 'Intermediate',
      requiredSkills: processedSkills,
      teamSize: teamSize || 4,
      duration: duration || '1-3 Months',
      owner: req.user._id,
      repositoryUrl: repositoryUrl || '',
      demoUrl: demoUrl || '',
      image: image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      lookingForTeammates: lookingForTeammates !== undefined ? lookingForTeammates : true,
    });

    // Add creator as Project Owner in ProjectMember
    await ProjectMember.create({
      project: project._id,
      user: req.user._id,
      role: 'Project Owner',
    });

    // Create activity record
    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: `created the project "${project.title}"`,
    });

    const populatedProject = await Project.findById(project._id).populate('owner', 'name avatar email');

    res.status(201).json({
      success: true,
      data: {
        ...populatedProject.toObject(),
        currentMemberCount: 1,
        progress: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'owner',
      'name avatar email college department year bio skills'
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const members = await ProjectMember.find({ project: project._id }).populate(
      'user',
      'name avatar email college department year skills bio github linkedin portfolio'
    );

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar')
      .populate('milestone', 'title');

    const milestones = await Milestone.find({ project: project._id }).sort({ createdAt: 1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter((m) => m.status === 'Completed').length;

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        members,
        tasks,
        milestones,
        stats: {
          totalTasks,
          completedTasks,
          pendingTasks: totalTasks - completedTasks,
          totalMilestones,
          completedMilestones,
          progress,
          currentMemberCount: members.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check ownership or Lead role
    const member = await ProjectMember.findOne({
      project: project._id,
      user: req.user._id,
    });

    if (!member || (member.role !== 'Project Owner' && member.role !== 'Team Lead')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this project',
      });
    }

    const {
      title,
      shortDescription,
      description,
      category,
      difficulty,
      requiredSkills,
      teamSize,
      duration,
      status,
      repositoryUrl,
      demoUrl,
      image,
      lookingForTeammates,
    } = req.body;

    if (title) project.title = title;
    if (shortDescription) project.shortDescription = shortDescription;
    if (description !== undefined) project.description = description;
    if (category) project.category = category;
    if (difficulty) project.difficulty = difficulty;
    if (status) project.status = status;
    if (teamSize) project.teamSize = teamSize;
    if (duration) project.duration = duration;
    if (repositoryUrl !== undefined) project.repositoryUrl = repositoryUrl;
    if (demoUrl !== undefined) project.demoUrl = demoUrl;
    if (image !== undefined) project.image = image;
    if (lookingForTeammates !== undefined) project.lookingForTeammates = lookingForTeammates;

    if (requiredSkills) {
      project.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : typeof requiredSkills === 'string'
        ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : project.requiredSkills;
    }

    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: `updated project details`,
    });

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can delete this project',
      });
    }

    await ProjectMember.deleteMany({ project: project._id });
    await Task.deleteMany({ project: project._id });
    await Milestone.deleteMany({ project: project._id });
    await JoinRequest.deleteMany({ project: project._id });

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get members of project
// @route   GET /api/projects/:id/members
// @access  Public
exports.getMembers = async (req, res, next) => {
  try {
    const members = await ProjectMember.find({ project: req.params.id }).populate(
      'user',
      'name avatar email college department year skills bio github linkedin portfolio'
    );
    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request to join project
// @route   POST /api/projects/:id/join
// @access  Private
exports.joinProject = async (req, res, next) => {
  try {
    const { message } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if already a member
    const existingMember = await ProjectMember.findOne({
      project: project._id,
      user: req.user._id,
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this project',
      });
    }

    // Check current member count vs teamSize
    const currentMemberCount = await ProjectMember.countDocuments({ project: project._id });
    if (currentMemberCount >= project.teamSize) {
      return res.status(400).json({
        success: false,
        message: 'Project team has reached its maximum size limit',
      });
    }

    // Check duplicate request
    const existingRequest = await JoinRequest.findOne({
      project: project._id,
      user: req.user._id,
      status: 'Pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending join request for this project',
      });
    }

    const joinRequest = await JoinRequest.create({
      project: project._id,
      user: req.user._id,
      message: message || '',
    });

    // Notify project owner
    await Notification.create({
      recipient: project.owner,
      type: 'JOIN_REQUEST_RECEIVED',
      title: 'New Join Request',
      message: `${req.user.name} requested to join "${project.title}"`,
      relatedProject: project._id,
    });

    res.status(201).json({
      success: true,
      message: 'Join request sent successfully',
      data: joinRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project member role
// @route   PUT /api/projects/:id/members/:memberId/role
// @access  Private
exports.updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Authorization check (Only owner can change roles)
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can update member roles',
      });
    }

    const memberDoc = await ProjectMember.findById(req.params.memberId);
    if (!memberDoc) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    memberDoc.role = role;
    await memberDoc.save();

    res.json({
      success: true,
      data: memberDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:memberId
// @access  Private
exports.removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const memberDoc = await ProjectMember.findById(req.params.memberId);
    if (!memberDoc) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Owner cannot be removed
    if (memberDoc.user.toString() === project.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Project owner cannot be removed from the team',
      });
    }

    // Check authorization: Owner or member leaving themselves
    if (
      project.owner.toString() !== req.user._id.toString() &&
      memberDoc.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove this member',
      });
    }

    await memberDoc.deleteOne();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: `removed member from team`,
    });

    res.json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
