import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = 'mongodb+srv://AI_scamshield:Sumit3434@ac-1cjfxf5.ybp546k.mongodb.net/scamshield?retryWrites=true&w=majority';
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
