import AdminUser from '../models/AdminUser.js';
import dotenv from 'dotenv';

dotenv.config();

const initAdmin = async () => {
  try {
    console.log('🔍 Checking for admin user...');
    
    // Check if admin already exists
    let admin = await AdminUser.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!admin) {
      console.log('📝 Creating new admin user...');
      admin = new AdminUser({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Abdirashid Mohamed Haji',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully');
      console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log('ℹ️  Admin user already exists');
      
      // Check if password needs to be updated
      const isPasswordCorrect = await admin.comparePassword(process.env.ADMIN_PASSWORD);
      if (!isPasswordCorrect) {
        console.log('ℹ️  Updating admin password...');
        admin.password = process.env.ADMIN_PASSWORD;
        await admin.save();
        console.log('✅ Admin password updated');
      }
    }
    
    console.log('🎉 Admin setup completed');
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    console.error('Error details:', error);
  }
};

export default initAdmin;