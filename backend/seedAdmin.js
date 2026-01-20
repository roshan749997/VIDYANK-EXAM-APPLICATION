const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.js');
const connectDB = require('./config/db.js');

dotenv.config();

const createAdminUser = async () => {
    try {
        await connectDB();

        console.log('🔍 Checking for existing admin users...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@vidyank.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('   Email: admin@vidyank.com');
            console.log('   You can login with this account.');
            process.exit(0);
        }

        console.log('📝 Creating admin user...');

        // Create admin user
        const adminUser = await User.create({
            firstName: 'Admin',
            lastName: 'Vidyank',
            email: 'admin@vidyank.com',
            password: 'Admin@123', // This will be hashed by the User model pre-save hook
            city: 'Mumbai',
            phone: '9999999999',
            category: 'Administrator',
            referralSource: 'System',
            instituteName: 'Vidyank',
            termsAccepted: true,
            role: 'admin',
            isAdmin: true,
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    admin@vidyank.com');
        console.log('🔑 Password: Admin@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');
        console.log('🎉 You can now login to the admin panel!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
