const express = require("express");
const router = express.Router();
const Person = require("../models/Person");

router.post("/", async (req, res) => {
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
    res.status(201).json(newPerson);
  } catch (err) {
    console.error("Error saving person:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
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
