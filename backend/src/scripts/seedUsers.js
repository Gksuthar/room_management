require('dotenv').config();

const connectDB = require('../config/db');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await connectDB();

    const users = ['Ganesh', 'Aditya'];

    for (const name of users) {
      await User.updateOne({ name }, { name }, { upsert: true });
    }

    console.log('Seed complete: Ganesh and Aditya are available.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedUsers();
