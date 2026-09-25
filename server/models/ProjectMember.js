const mongoose = require('mongoose');

const projectMemberSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['Project Owner', 'Team Lead', 'Developer', 'Designer', 'Researcher', 'Tester', 'Other'],
      default: 'Developer',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate user membership in a single project
projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ProjectMember', projectMemberSchema);
