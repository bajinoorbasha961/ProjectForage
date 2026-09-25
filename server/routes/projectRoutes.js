const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getMembers,
  joinProject,
  updateMemberRole,
  removeMember,
} = require('../controllers/projectController');
const { getProjectActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.get('/:id/members', getMembers);
router.post('/:id/join', protect, joinProject);
router.put('/:id/members/:memberId/role', protect, updateMemberRole);
router.delete('/:id/members/:memberId', protect, removeMember);
router.get('/:projectId/activities', getProjectActivities);

router.route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
