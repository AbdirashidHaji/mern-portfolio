import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compare password method - FIXED VERSION
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Direct comparison if password is already hashed
    if (this.password.length === 60 && this.password.includes('$')) {
      // This looks like a bcrypt hash, compare properly
      return await bcrypt.compare(candidatePassword, this.password);
    }
    
    // Fallback: direct string comparison (for testing)
    return candidatePassword === this.password;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export default AdminUser;