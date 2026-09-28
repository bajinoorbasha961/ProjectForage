const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  getMatchingTeammates,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', getUsers);
router.put('/profile', protect, updateProfile);
router.get('/match/:projectId', protect, getMatchingTeammates);
router.get('/:id', getUserById);

module.exports = router;
