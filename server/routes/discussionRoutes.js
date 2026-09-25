const express = require('express');
const router = express.Router();
const {
  getDiscussions,
  createDiscussion,
  replyDiscussion,
  deleteDiscussion,
  deleteReply,
} = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

router.get('/projects/:projectId/discussions', getDiscussions);
router.post('/projects/:projectId/discussions', protect, createDiscussion);

router.post('/discussions/:id/replies', protect, replyDiscussion);

// Place /discussions/replies/:replyId BEFORE /discussions/:id
router.delete('/discussions/replies/:replyId', protect, deleteReply);
router.delete('/discussions/:id', protect, deleteDiscussion);

module.exports = router;
