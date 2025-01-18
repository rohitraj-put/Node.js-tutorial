const express = require("express");
const router = express.Router();
const Person = require("../models/Person");
const { jwtAuth, generateToken } = require("../Middlewares/jwtAuth");
const multer = require("multer");

// setupmulter for image
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    const data = req.body; // Ensure req.body is parsed with express.json()
    const exitngPerson = await Person.findOne({ name: data.name });
    if (exitngPerson) {
      console.log("Person already exists:", exitngPerson);
      return res.status(409).json({ error: "Person already exists" });
    }

    const person = new Person(data);
    const newPerson = await person.save();
    console.log("Data saved:", newPerson);

    const payload = {
      id: newPerson._id,
      username: newPerson.username,
      name: newPerson.name,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("token is:", token);
    res.status(201).json({ newPerson: newPerson, token: token });
  } catch (err) {
    console.error("Error saving person:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login routes

router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const person = await Person.findOne({ username: data.username });
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    const isPasswordValid = await person.comparePassword(data.password);
    if (!isPasswordValid || !person) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const payload = {
      id: person._id,
      name: person.name,
      username: person.username,
    };
    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.error("Error finding person:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// profile routes
router.get("/profile", jwtAuth, async (req, res) => {
  try {
    const userData = req.user; // Extract user data from JWT
    console.log("User Data:", userData);

    if (!userData || !userData.id) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const userId = userData.id; // Correctly reference userId
    const userProfile = await Person.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", jwtAuth, async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (err) {
    console.error("Error fetching persons:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const data = req.body;
    const updatedPerson = await Person.findByIdAndUpdate(personId, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(updatedPerson);
  } catch (err) {
    console.error("Error updating person:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const deletedPerson = await Person.findByIdAndDelete(personId);
    if (!deletedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json({ Message: "Person deleted successfully" });
  } catch (err) {
    console.error("Error deleting person:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;
    if (["Web Developer", "Softwere Engineer", "Student"].includes(workType)) {
      const persons = await Person.find({ work: workType });
      res.json(persons);
    }
  } catch (err) {
    console.error("Error fetching persons:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
