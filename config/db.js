const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGODB_URL;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
