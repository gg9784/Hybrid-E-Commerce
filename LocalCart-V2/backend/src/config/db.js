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
        console.log("❌ MONGODB connection FAILED!");
        console.error(`Error: ${error.message}`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log("\n💡 TIP: Connection refused. Check if your current IP address is whitelisted in MongoDB Atlas or if the port is blocked.");
        } else if (error.message.includes('authentication failed')) {
            console.log("\n💡 TIP: Authentication failed. Please check your DB_USER and DB_PASSWORD in the URI.");
        }
        
        // In some development flows, we might want the server to keep trying or at least not exit immediately
        // But for now, we'll keep the exit to alert the user clearly.
        process.exit(1);
    }
}


export default connectDB;