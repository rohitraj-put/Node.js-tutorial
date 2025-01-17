const http = require("http");
const express = require("express");
const mongoose = require("mongoose"); // Ensure mongoose is used for DB connection
const app = express();
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes");
const personRoutes = require("./routes/personRoutes");
const passport = require("./Middlewares/auth");

require("dotenv").config();

const URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(passport.initialize());
// Middleware to parse JSON
app.use(express.json());
app.use(logRequest);

// Connect to the database
connectDB();

const localAuthMiddleware = passport.authenticate("local", { session: false });
app.use("/", localAuthMiddleware, (req, res) => {
  res.send("Welcome to the Restaurant API");
});
app.use("/person", personRoutes);
app.use("/menu", menuRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
