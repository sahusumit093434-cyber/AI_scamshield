import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/scamshield';
  
  try {
    console.log('Connecting to database...');
    cachedConnection = await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected successfully: ${mongoose.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    cachedConnection = null;
    throw error;
  }
};

export default connectDB;
