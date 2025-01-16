const http = require("http");
const express = require("express");
const mongoose = require("mongoose"); // Ensure mongoose is used for DB connection
const app = express();
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes");
const personRoutes = require("./routes/personRoutes");

const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectDB();

app.use("/person", personRoutes);
app.use("/menu", menuRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
