import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in your environment variables!");
        }
        
        console.log("Attempting to connect to MongoDB Atlas...");
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\n ✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("❌ MONGODB connection FAILED ", error.message);
        process.exit(1);
    }
}

export default connectDB;