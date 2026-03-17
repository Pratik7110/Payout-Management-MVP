import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Vendor from '../models/Vendor';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/payout_management';
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Vendor.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        email: 'ops@demo.com',
        password: 'ops123',
        role: 'OPS',
      },
      {
        email: 'finance@demo.com',
        password: 'fin123',
        role: 'FINANCE',
      },
    ]);
    console.log('✓ Created 2 users');

    // Create sample vendors
    const vendors = await Vendor.create([
      {
        name: 'Acme Corporation',
        upi_id: 'acme@upi',
        bank_account: '1234567890',
        ifsc: 'HDFC0001234',
        is_active: true,
      },
      {
        name: 'Tech Solutions Ltd',
        upi_id: 'techsol@upi',
        bank_account: '0987654321',
        ifsc: 'ICIC0005678',
        is_active: true,
      },
      {
        name: 'Global Services Inc',
        upi_id: 'global@upi',
        bank_account: '5555666677',
        ifsc: 'AXIS0009999',
        is_active: true,
      },
    ]);
    console.log('✓ Created 3 sample vendors');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('OPS User: ops@demo.com / ops123');
    console.log('FINANCE User: finance@demo.com / fin123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
