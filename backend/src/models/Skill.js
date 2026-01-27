import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'tool'],
    required: true
  },
  proficiency: {
    type: Number,
    min: 1,
    max: 100,
    default: 50
  },
  icon: {
    type: String,
    default: '💻'
  },
  order: {
    type: Number,
    default: 0
  }
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;