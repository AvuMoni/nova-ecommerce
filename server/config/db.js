
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing.");
    }

    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 15000,
      }
    );

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code || "Not provided");
    console.error("Error message:", error.message);

    if (error.cause) {
      console.error("Underlying cause:", error.cause.message);
    }

    process.exit(1);
  }
};

module.exports = connectDB;
