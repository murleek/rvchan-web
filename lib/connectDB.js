import console from 'console';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}
const connectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    console.log("currentDB");
    // Use current db connection
    return handler(req, res);
  }
  console.log("newDB");
  // Use new db connection
  await mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
  });
  return handler(req, res);
};

export default connectDB;
