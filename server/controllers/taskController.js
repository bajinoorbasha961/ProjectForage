const Task = require('../models/Task');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Public
exports.getTasks = async (req, res, next) => {
  try {
    const { milestone, status, priority, assignedTo } = req.query;
    const query = { project: req.params.projectId };

    if (milestone) query.milestone = milestone;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name avatar email')
      .populate('createdBy', 'name avatar')
      .populate('milestone', 'title status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, milestone, assignedTo, priority, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check member authorization
    const isMember = await ProjectMember.findOne({
      project: req.params.projectId,
      user: req.user._id,
    });
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only team members can create tasks for this project',
      });
    }

    const task = await Task.create({
      project: req.params.projectId,
      milestone: milestone || null,
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'Todo',
      dueDate: dueDate || null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name avatar email')
      .populate('createdBy', 'name avatar')
      .populate('milestone', 'title status');

    await Activity.create({
      project: req.params.projectId,
      user: req.user._id,
      action: `created task "${task.title}"`,
    });

    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignedTo,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: `You were assigned task "${task.title}" in "${project.title}"`,
        relatedProject: project._id,
        relatedTask: task._id,
      });
    }

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details or status
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isMember = await ProjectMember.findOne({
      project: task.project,
      user: req.user._id,
    });

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only project team members can update tasks',
      });
    }

    const { title, description, milestone, assignedTo, priority, status, dueDate } = req.body;

    const previousStatus = task.status;
    const previousAssignee = task.assignedTo ? task.assignedTo.toString() : null;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (milestone !== undefined) task.milestone = milestone || null;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name avatar email')
      .populate('createdBy', 'name avatar')
      .populate('milestone', 'title status');

    // Create activity record
    let actionMessage = `updated task "${task.title}"`;
    if (previousStatus !== task.status) {
      actionMessage = `changed task status of "${task.title}" to ${task.status}`;
      if (task.status === 'Completed') {
        actionMessage = `completed task "${task.title}"`;
      }
    }

    await Activity.create({
      project: task.project,
      user: req.user._id,
      action: actionMessage,
    });

    // Notify newly assigned user if assignee changed
    if (
      task.assignedTo &&
      task.assignedTo.toString() !== previousAssignee &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      await Notification.create({
        recipient: task.assignedTo,
        type: 'TASK_ASSIGNED',
        title: 'Task Assigned',
        message: `You were assigned task "${task.title}"`,
        relatedProject: task.project,
        relatedTask: task._id,
      });
    }

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isMember = await ProjectMember.findOne({
      project: task.project,
      user: req.user._id,
    });

    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Activity.create({
      project: task.project,
      user: req.user._id,
      action: `deleted task "${task.title}"`,
    });

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
