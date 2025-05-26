import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://admin:password@localhost:27017/mern_assessment_db?authSource=admin";

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DATABASE_URL environment variable inside .env.local'
  );
}

let cachedClient: typeof mongoose | null = null;

async function dbConnect() {
  if (cachedClient) {
    return cachedClient;
  }
  try {
    cachedClient = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
    return cachedClient;
  } catch (e) {
    console.error("MongoDB connection error:", e);
    throw e;
  }
}

export default dbConnect;