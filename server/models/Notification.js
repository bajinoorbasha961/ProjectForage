const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'INVITATION_RECEIVED',
        'INVITATION_ACCEPTED',
        'INVITATION_REJECTED',
        'JOIN_REQUEST_RECEIVED',
        'JOIN_REQUEST_ACCEPTED',
        'JOIN_REQUEST_REJECTED',
        'TASK_ASSIGNED',
        'TASK_UPDATED',
        'MILESTONE_COMPLETED',
        'PROJECT_MESSAGE',
        'MEMBER_JOINED',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
