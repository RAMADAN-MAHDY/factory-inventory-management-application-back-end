import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});

    const users = [
      { username: 'owner', password: 'owner123', role: 'owner' },
      { username: 'manager', password: 'manager123', role: 'manager' }
    ];

    await User.create(users);
    console.log('Users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seed();
