const DiscussionPost = require('../models/DiscussionPost');
const DiscussionReply = require('../models/DiscussionReply');
const ProjectMember = require('../models/ProjectMember');
const Activity = require('../models/Activity');

// @desc    Get project discussion posts
// @route   GET /api/projects/:projectId/discussions
// @access  Public
exports.getDiscussions = async (req, res, next) => {
  try {
    const posts = await DiscussionPost.find({ project: req.params.projectId })
      .populate('author', 'name avatar email college department')
      .sort({ createdAt: -1 });

    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const replies = await DiscussionReply.find({ post: post._id })
          .populate('author', 'name avatar email college department')
          .sort({ createdAt: 1 });

        return {
          ...post.toObject(),
          replies,
        };
      })
    );

    res.json({
      success: true,
      count: postsWithReplies.length,
      data: postsWithReplies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create discussion post
// @route   POST /api/projects/:projectId/discussions
// @access  Private
exports.createDiscussion = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Discussion content is required' });
    }

    const isMember = await ProjectMember.findOne({
      project: req.params.projectId,
      user: req.user._id,
    });

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only project team members can post discussions',
      });
    }

    const post = await DiscussionPost.create({
      project: req.params.projectId,
      author: req.user._id,
      title: title || '',
      content,
    });

    const populatedPost = await DiscussionPost.findById(post._id).populate(
      'author',
      'name avatar email college department'
    );

    await Activity.create({
      project: req.params.projectId,
      user: req.user._id,
      action: `started a new discussion topic`,
    });

    res.status(201).json({
      success: true,
      data: {
        ...populatedPost.toObject(),
        replies: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a discussion post
// @route   POST /api/discussions/:id/replies
// @access  Private
exports.replyDiscussion = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    const post = await DiscussionPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Discussion post not found' });
    }

    const isMember = await ProjectMember.findOne({
      project: post.project,
      user: req.user._id,
    });

    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Only team members can reply' });
    }

    const reply = await DiscussionReply.create({
      post: post._id,
      author: req.user._id,
      content,
    });

    const populatedReply = await DiscussionReply.findById(reply._id).populate(
      'author',
      'name avatar email college department'
    );

    res.status(201).json({
      success: true,
      data: populatedReply,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a discussion post
// @route   DELETE /api/discussions/:id
// @access  Private
exports.deleteDiscussion = async (req, res, next) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own posts' });
    }

    await DiscussionReply.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({
      success: true,
      message: 'Discussion post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a discussion reply
// @route   DELETE /api/discussions/replies/:replyId
// @access  Private
exports.deleteReply = async (req, res, next) => {
  try {
    const reply = await DiscussionReply.findById(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own replies' });
    }

    await reply.deleteOne();

    res.json({
      success: true,
      message: 'Reply deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
