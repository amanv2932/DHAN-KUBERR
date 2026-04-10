const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dhankuber";

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB unavailable, using in-memory fallback:", error.message);
    return false;
  }
};

module.exports = connectDB;
