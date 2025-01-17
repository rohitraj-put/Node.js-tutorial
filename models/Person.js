const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

PersonSchema.pre("save", async function (next) {
  const person = this;
  if (!person.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(person.password, salt);
    person.password = hash;
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    next(err);
  }
});

PersonSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (err) {
    console.error("Error comparing password:", err);
    return false;
  }
};

module.exports = mongoose.model("user", PersonSchema);
