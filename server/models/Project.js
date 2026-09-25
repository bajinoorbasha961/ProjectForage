const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile Development',
        'AI/ML',
        'Data Science',
        'Cybersecurity',
        'IoT',
        'Blockchain',
        'Cloud',
        'Game Development',
        'UI/UX',
        'Other',
      ],
      default: 'Web Development',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    teamSize: {
      type: Number,
      default: 4,
      min: 1,
      max: 20,
    },
    duration: {
      type: String,
      default: '1-3 Months',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
      default: 'Planning',
    },
    repositoryUrl: {
      type: String,
      default: '',
    },
    demoUrl: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    lookingForTeammates: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
