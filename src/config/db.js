import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(env.mongoUri, {
      dbName: env.mongoDbName
    });

    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};
