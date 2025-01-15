const express = require("express");
const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  work: {
    type: String,
    enum: ["Web Developer", "Software Engineer", "Student"],
  },
});

module.exports = mongoose.model("DataRohit", PersonSchema);
