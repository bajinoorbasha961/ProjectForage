const Activity = require('../models/Activity');

// @desc    Get activity feed for a project
// @route   GET /api/projects/:projectId/activities
// @access  Public
exports.getProjectActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ project: req.params.projectId })
      .populate('user', 'name avatar email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};
