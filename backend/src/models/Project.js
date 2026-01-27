import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required'],
    maxlength: [2000, 'Detailed description cannot exceed 2000 characters']
  },
  technologies: [{
    type: String,
    required: true
  }],
  githubUrl: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: [true, 'Project image is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'fullstack', 'other'],
    default: 'web'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Remove the pre-save middleware causing the issue
// projectSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// Instead, update updatedAt manually in controller or use a different approach
projectSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;