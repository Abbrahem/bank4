const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./Admin');
require('dotenv').config({ path: '.env.local' });

async function addAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'bank@gmail.com';
  const password = 'bank123';
  const hash = await bcrypt.hash(password, 10);
  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  await Admin.create({ email, password: hash });
  console.log('Admin created successfully');
  process.exit(0);
}

addAdmin(); 