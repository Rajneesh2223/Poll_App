import mongoose from "mongoose";
import dns from "dns";
import { DB_URL } from "./veriables.js";

// Set custom secure DNS servers to bypass local ISP DNS limits on Windows
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder('ipv4first');

export const connectDB = async () => {
    try{
        await mongoose.connect(DB_URL);
        console.log("Database connected successfully");
    }
    catch(err){
        console.log("Database connection failed");
        console.log(err);
    }
}