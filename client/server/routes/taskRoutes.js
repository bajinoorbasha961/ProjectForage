const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Project tasks: /api/projects/:projectId/tasks
router.route('/projects/:projectId/tasks')
  .get(getTasks)
  .post(protect, createTask);

// Specific task: /api/tasks/:id
router.route('/tasks/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
