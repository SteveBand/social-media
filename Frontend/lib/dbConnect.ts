import mongoose from "mongoose";
let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URI) return console.log("Missing MongoDB URL");
  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
    return connection.connection.db;
  } catch (error) {
    console.log(error);
  }
};
