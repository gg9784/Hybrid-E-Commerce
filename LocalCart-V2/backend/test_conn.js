import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const connectDB = async () => {
    try {
        console.log("Testing connection with URI:", process.env.MONGODB_URI.split('@')[1]); // Log only the host part for privacy
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ SUCCESS: Connected to MongoDB Atlas with standard URI!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ FAILURE:", error.message);
        process.exit(1);
    }
}

connectDB();
