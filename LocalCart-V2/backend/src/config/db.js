import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in your environment variables!");
        }
        
        console.log("Attempting to connect to MongoDB Atlas...");
        
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            // Using standard options for better stability
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`\n ✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("\n❌ MONGODB connection FAILED!");
        console.error(`Error: ${error.message}`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log("\n💡 TIP: Connection refused. This usually happens because of DNS resolution issues with '+srv' on Windows.");
            console.log("👉 We have switched to the standard 'mongodb://' format which should be more stable.");
            console.log("👉 Also, check if your current IP address is whitelisted in MongoDB Atlas.");
        } else if (error.message.includes('authentication failed')) {
            console.log("\n💡 TIP: Authentication failed. Please check your credentials in the MONGODB_URI.");
        }
        
        process.exit(1);
    }
}


export default connectDB;