const express = require("express");
const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["Veg", "Non-Veg"],
  },
  rating: {
    type: Number,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
