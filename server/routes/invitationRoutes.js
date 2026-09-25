const express = require('express');
const router = express.Router();
const {
  createInvitation,
  getUserInvitations,
  respondInvitation,
  respondJoinRequest,
} = require('../controllers/invitationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createInvitation);
router.get('/', getUserInvitations);

// Specific sub-paths MUST come before generic parameterized :id route
router.put('/requests/:id', respondJoinRequest);
router.put('/:id', respondInvitation);

module.exports = router;
