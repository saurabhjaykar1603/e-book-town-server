import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB " + mongoose.connection.host);
    });
    mongoose.connection.on("error", (err) => {
      console.log("Error connecting to MongoDB", err);
    });
    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.error(`Error: Field to connect database`);
    process.exit(1);
  }
};
export default connectDB;
