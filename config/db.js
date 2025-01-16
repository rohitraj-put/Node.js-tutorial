const mongoose = require("mongoose");

const URL =
  "mongodb+srv://rohitraj05072000:tOCNsMW9pRjwFL2x@cluster1.v38ys.mongodb.net/e-commerce";
// const URL = "mongodb://localhost:27017/users";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
