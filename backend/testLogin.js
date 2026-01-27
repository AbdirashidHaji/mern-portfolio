import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get the model
    let AdminUser;
    try {
      AdminUser = mongoose.model('AdminUser');
    } catch {
      const adminUserSchema = new mongoose.Schema({
        email: String,
        password: String,
        name: String,
        role: String
      });
      AdminUser = mongoose.model('AdminUser', adminUserSchema);
    }
    
    const admin = await AdminUser.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!admin) {
      console.log('No admin found. Creating...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      
      await AdminUser.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        name: 'Abdirashid Mohamed Haji',
        role: 'admin'
      });
      
      console.log('Admin created with password:', process.env.ADMIN_PASSWORD);
    } else {
      console.log('Admin exists.');
      console.log('Stored password (first 20 chars):', admin.password.substring(0, 20) + '...');
      
      // Test password
      const testPassword = process.env.ADMIN_PASSWORD;
      console.log('Testing password:', testPassword);
      
      // Try bcrypt compare
      const isMatch = await bcrypt.compare(testPassword, admin.password);
      console.log('Bcrypt compare result:', isMatch);
      
      // Try direct compare (for debugging)
      console.log('Direct compare (for debug):', testPassword === admin.password);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();