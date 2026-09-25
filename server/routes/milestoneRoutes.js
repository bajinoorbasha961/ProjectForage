const express = require('express');
const router = express.Router();
const {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} = require('../controllers/milestoneController');
const { protect } = require('../middleware/auth');

// Project milestones: /api/projects/:projectId/milestones
router.route('/projects/:projectId/milestones')
  .get(getMilestones)
  .post(protect, createMilestone);

// Specific milestone: /api/milestones/:id
router.route('/milestones/:id')
  .put(protect, updateMilestone)
  .delete(protect, deleteMilestone);

module.exports = router;
