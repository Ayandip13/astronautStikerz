require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkUser() {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteOne({ email: 'batman@gmail.com' });
    console.log('Deleted batman@gmail.com');
    process.exit(0);
}

checkUser();
