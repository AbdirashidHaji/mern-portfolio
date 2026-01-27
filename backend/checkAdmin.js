import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Try to find the AdminUser model
    let AdminUser;
    try {
      AdminUser = mongoose.model('AdminUser');
    } catch {
      // If model doesn't exist, create it
      const adminUserSchema = new mongoose.Schema({
        email: String,
        password: String,
        name: String,
        role: String,
        lastLogin: Date,
        createdAt: Date
      });
      AdminUser = mongoose.model('AdminUser', adminUserSchema);
    }
    
    const admin = await AdminUser.findOne({ email: process.env.ADMIN_EMAIL });
    console.log('Admin found:', !!admin);
    
    if (admin) {
      console.log('Admin details:');
      console.log('- Email:', admin.email);
      console.log('- Name:', admin.name);
      console.log('- Created:', admin.createdAt);
    } else {
      console.log('No admin found. Creating one...');
      
      // Simple password hash
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      
      await AdminUser.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        name: 'Abdirashid Mohamed Haji',
        role: 'admin',
        createdAt: new Date()
      });
      
      console.log('Admin created successfully!');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAdmin();