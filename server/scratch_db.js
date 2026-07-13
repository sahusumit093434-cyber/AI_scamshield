import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/scamshield';
console.log('Testing connection to:', uri.replace(/:[^@]+@/, ':****@'));

mongoose.connect(uri)
  .then(conn => {
    console.log('Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
