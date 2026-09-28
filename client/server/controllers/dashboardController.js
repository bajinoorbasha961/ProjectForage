const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const Activity = require('../models/Activity');

// @desc    Get dashboard metrics & statistics for current user
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Projects user is owner or member of
    const memberships = await ProjectMember.find({ user: userId }).populate({
      path: 'project',
      populate: { path: 'owner', select: 'name avatar' },
    });

    const myProjectsList = memberships.map((m) => m.project).filter(Boolean);
    const myProjectIds = myProjectsList.map((p) => p._id);

    const projectsCreatedCount = await Project.countDocuments({ owner: userId });
    const projectsJoinedCount = myProjectsList.length;

    // 2. Tasks assigned to user
    const assignedTasks = await Task.find({ assignedTo: userId })
      .populate('project', 'title category')
      .populate('milestone', 'title')
      .sort({ dueDate: 1, createdAt: -1 });

    const tasksAssignedCount = assignedTasks.length;
    const tasksCompletedCount = assignedTasks.filter((t) => t.status === 'Completed').length;
    const overallCompletionPercentage =
      tasksAssignedCount > 0 ? Math.round((tasksCompletedCount / tasksAssignedCount) * 100) : 0;

    // 3. Upcoming pending tasks
    const upcomingTasks = assignedTasks
      .filter((t) => t.status !== 'Completed')
      .slice(0, 6);

    // 4. Recent activities across user's projects
    const recentActivities = await Activity.find({ project: { $in: myProjectIds } })
      .populate('user', 'name avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // 5. Enhance my projects with progress
    const myProjectsEnhanced = await Promise.all(
      myProjectsList.map(async (project) => {
        const pTasks = await Task.find({ project: project._id });
        const pMembers = await ProjectMember.find({ project: project._id });
        const pCompleted = pTasks.filter((t) => t.status === 'Completed').length;
        const progress = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;

        return {
          ...project.toObject(),
          memberCount: pMembers.length,
          taskCount: pTasks.length,
          completedTaskCount: pCompleted,
          progress,
        };
      })
    );

    res.json({
      success: true,
      data: {
        stats: {
          projectsCreated: projectsCreatedCount,
          projectsJoined: projectsJoinedCount,
          tasksAssigned: tasksAssignedCount,
          tasksCompleted: tasksCompletedCount,
          overallCompletionPercentage,
        },
        myProjects: myProjectsEnhanced,
        upcomingTasks,
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};
