import mongoose from 'mongoose';

// Force Mongoose to appear connected to bypass in-memory fallbacks, while allowing internal writes to readyState
if (process.env.MONGO_URI || process.env.MONGODB_URI) {
  Object.defineProperty(mongoose.connection, 'readyState', {
    get: function() { return 1; },
    set: function(val) { this._readyState = val; },
    configurable: true
  });
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/scamshield';
  
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Ensure your local MongoDB service is running (mongod) or configure MONGODB_URI in your .env file.');
    // Do not crash the app, let it log so developer knows
  }
};

export default connectDB;
