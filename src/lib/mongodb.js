import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log("❌ Please define the MONGODB_URI in .env.local");
}

let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState;
        console.log("✅ Connected to MongoDB & isConnected:", isConnected);
    } catch (error) {
        console.log("❌ MongoDB is Not Connected:", error);
    }
}