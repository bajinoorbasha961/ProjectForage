const Message = require('../models/Message');
const ProjectMember = require('../models/ProjectMember');

// @desc    Get chat messages for a project
// @route   GET /api/projects/:projectId/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const isMember = await ProjectMember.findOne({
      project: req.params.projectId,
      user: req.user._id,
    });

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only team members can access project chat',
      });
    }

    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender', 'name avatar email')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
