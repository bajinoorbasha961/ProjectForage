const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// @desc    Get milestones for project
// @route   GET /api/projects/:projectId/milestones
// @access  Public
exports.getMilestones = async (req, res, next) => {
  try {
    const milestones = await Milestone.find({ project: req.params.projectId }).sort({ createdAt: 1 });

    const milestonesWithProgress = await Promise.all(
      milestones.map(async (m) => {
        const tasks = await Task.find({ milestone: m._id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : m.status === 'Completed' ? 100 : 0;

        return {
          ...m.toObject(),
          totalTasks,
          completedTasks,
          progress,
        };
      })
    );

    res.json({
      success: true,
      count: milestonesWithProgress.length,
      data: milestonesWithProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create milestone
// @route   POST /api/projects/:projectId/milestones
// @access  Private
exports.createMilestone = async (req, res, next) => {
  try {
    const { title, description, startDate, dueDate, status } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Milestone title is required' });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const member = await ProjectMember.findOne({
      project: req.params.projectId,
      user: req.user._id,
    });

    if (!member || (member.role !== 'Project Owner' && member.role !== 'Team Lead')) {
      return res.status(403).json({
        success: false,
        message: 'Only Project Owner or Team Lead can create milestones',
      });
    }

    const milestone = await Milestone.create({
      project: req.params.projectId,
      title,
      description: description || '',
      startDate: startDate || Date.now(),
      dueDate: dueDate || null,
      status: status || 'Not Started',
    });

    await Activity.create({
      project: req.params.projectId,
      user: req.user._id,
      action: `created milestone "${milestone.title}"`,
    });

    res.status(201).json({
      success: true,
      data: {
        ...milestone.toObject(),
        totalTasks: 0,
        completedTasks: 0,
        progress: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update milestone
// @route   PUT /api/milestones/:id
// @access  Private
exports.updateMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const member = await ProjectMember.findOne({
      project: milestone.project,
      user: req.user._id,
    });

    if (!member || (member.role !== 'Project Owner' && member.role !== 'Team Lead')) {
      return res.status(403).json({
        success: false,
        message: 'Only Project Owner or Team Lead can update milestones',
      });
    }

    const { title, description, startDate, dueDate, status } = req.body;

    const previousStatus = milestone.status;

    if (title) milestone.title = title;
    if (description !== undefined) milestone.description = description;
    if (startDate) milestone.startDate = startDate;
    if (dueDate) milestone.dueDate = dueDate;
    if (status) milestone.status = status;

    await milestone.save();

    if (previousStatus !== milestone.status && milestone.status === 'Completed') {
      await Activity.create({
        project: milestone.project,
        user: req.user._id,
        action: `completed milestone "${milestone.title}" 🎉`,
      });

      // Notify team members
      const allMembers = await ProjectMember.find({ project: milestone.project });
      const notifications = allMembers
        .filter((m) => m.user.toString() !== req.user._id.toString())
        .map((m) => ({
          recipient: m.user,
          type: 'MILESTONE_COMPLETED',
          title: 'Milestone Completed',
          message: `Milestone "${milestone.title}" has been marked as completed!`,
          relatedProject: milestone.project,
        }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.json({
      success: true,
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete milestone
// @route   DELETE /api/milestones/:id
// @access  Private
exports.deleteMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const member = await ProjectMember.findOne({
      project: milestone.project,
      user: req.user._id,
    });

    if (!member || (member.role !== 'Project Owner' && member.role !== 'Team Lead')) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Task.updateMany({ milestone: milestone._id }, { $unset: { milestone: 1 } });
    await milestone.deleteOne();

    res.json({
      success: true,
      message: 'Milestone deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
