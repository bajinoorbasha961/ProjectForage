const Invitation = require('../models/Invitation');
const JoinRequest = require('../models/JoinRequest');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');

// @desc    Send invitation to student
// @route   POST /api/invitations
// @access  Private
exports.createInvitation = async (req, res, next) => {
  try {
    const { projectId, recipientId, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Authorization check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can invite teammates',
      });
    }

    // Check max team size
    const currentMemberCount = await ProjectMember.countDocuments({ project: projectId });
    if (currentMemberCount >= project.teamSize) {
      return res.status(400).json({
        success: false,
        message: 'Project team has reached its maximum size limit',
      });
    }

    // Check if recipient is already a member
    const existingMember = await ProjectMember.findOne({
      project: projectId,
      user: recipientId,
    });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Student is already a member of this project',
      });
    }

    // Check existing pending invitation
    const existingInvitation = await Invitation.findOne({
      project: projectId,
      recipient: recipientId,
      status: 'Pending',
    });
    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: 'An invitation is already pending for this student',
      });
    }

    const invitation = await Invitation.create({
      project: projectId,
      sender: req.user._id,
      recipient: recipientId,
      message: message || `Join our project "${project.title}"!`,
    });

    // Notify recipient
    await Notification.create({
      recipient: recipientId,
      type: 'INVITATION_RECEIVED',
      title: 'Project Invitation',
      message: `${req.user.name} invited you to join "${project.title}"`,
      relatedProject: projectId,
    });

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's invitations & join requests
// @route   GET /api/invitations
// @access  Private
exports.getUserInvitations = async (req, res, next) => {
  try {
    const invitations = await Invitation.find({ recipient: req.user._id })
      .populate('project')
      .populate('sender', 'name avatar email college department')
      .sort({ createdAt: -1 });

    const myJoinRequests = await JoinRequest.find({ user: req.user._id })
      .populate('project')
      .sort({ createdAt: -1 });

    // Also get join requests for projects owned by logged in user
    const myOwnedProjects = await Project.find({ owner: req.user._id });
    const ownedProjectIds = myOwnedProjects.map((p) => p._id);

    const receivedJoinRequests = await JoinRequest.find({
      project: { $in: ownedProjectIds },
    })
      .populate('project')
      .populate('user', 'name avatar email college department skills year')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        invitations,
        myJoinRequests,
        receivedJoinRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to invitation (Accept / Reject)
// @route   PUT /api/invitations/:id
// @access  Private
exports.respondInvitation = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const invitation = await Invitation.findById(req.params.id)
      .populate('project')
      .populate('sender', 'name email');

    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    if (invitation.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    invitation.status = status;
    await invitation.save();

    if (status === 'Accepted') {
      // Check team size limit
      const currentCount = await ProjectMember.countDocuments({ project: invitation.project._id });
      if (currentCount >= invitation.project.teamSize) {
        return res.status(400).json({
          success: false,
          message: 'Project is already full',
        });
      }

      // Add to ProjectMember if not present
      await ProjectMember.findOneAndUpdate(
        { project: invitation.project._id, user: req.user._id },
        { project: invitation.project._id, user: req.user._id, role: 'Developer' },
        { upsert: true, new: true }
      );

      // Create activity feed
      await Activity.create({
        project: invitation.project._id,
        user: req.user._id,
        action: `joined the team`,
      });

      // Notify owner
      await Notification.create({
        recipient: invitation.sender._id,
        type: 'INVITATION_ACCEPTED',
        title: 'Invitation Accepted',
        message: `${req.user.name} accepted your invitation to join "${invitation.project.title}"`,
        relatedProject: invitation.project._id,
      });
    } else {
      // Notify owner of rejection
      await Notification.create({
        recipient: invitation.sender._id,
        type: 'INVITATION_REJECTED',
        title: 'Invitation Declined',
        message: `${req.user.name} declined your invitation to join "${invitation.project.title}"`,
        relatedProject: invitation.project._id,
      });
    }

    res.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to join request (Accept / Reject)
// @route   PUT /api/invitations/requests/:id
// @access  Private
exports.respondJoinRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const joinRequest = await JoinRequest.findById(req.params.id)
      .populate('project')
      .populate('user', 'name email');

    if (!joinRequest) {
      return res.status(404).json({ success: false, message: 'Join request not found' });
    }

    // Check project owner authorization
    if (joinRequest.project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only project owner can respond to join requests' });
    }

    joinRequest.status = status;
    await joinRequest.save();

    if (status === 'Accepted') {
      const currentCount = await ProjectMember.countDocuments({ project: joinRequest.project._id });
      if (currentCount >= joinRequest.project.teamSize) {
        return res.status(400).json({
          success: false,
          message: 'Project has reached max team size',
        });
      }

      await ProjectMember.findOneAndUpdate(
        { project: joinRequest.project._id, user: joinRequest.user._id },
        { project: joinRequest.project._id, user: joinRequest.user._id, role: 'Developer' },
        { upsert: true, new: true }
      );

      await Activity.create({
        project: joinRequest.project._id,
        user: joinRequest.user._id,
        action: `joined the team`,
      });

      await Notification.create({
        recipient: joinRequest.user._id,
        type: 'JOIN_REQUEST_ACCEPTED',
        title: 'Join Request Approved!',
        message: `Your request to join "${joinRequest.project.title}" was accepted`,
        relatedProject: joinRequest.project._id,
      });
    } else {
      await Notification.create({
        recipient: joinRequest.user._id,
        type: 'JOIN_REQUEST_REJECTED',
        title: 'Join Request Declined',
        message: `Your request to join "${joinRequest.project.title}" was declined`,
        relatedProject: joinRequest.project._id,
      });
    }

    res.json({
      success: true,
      data: joinRequest,
    });
  } catch (error) {
    next(error);
  }
};
