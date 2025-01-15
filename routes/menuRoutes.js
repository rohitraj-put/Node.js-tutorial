const express = require("express");
const Menu = require("../models/menu");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const exitngMenu = await Menu.findOne({ name: data.name });
    if (exitngMenu) {
      console.log("Menu already exists:", exitngMenu);
      return res.status(409).json({ error: "Menu already exists" });
    }
    const menu = new Menu(data);
    const newMenu = await menu.save();
    console.log("Data saved:", newMenu);
    res.status(201).json(newMenu);
  } catch (err) {
    console.error("Error saving menu:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    console.error("fatch menu data", err);
    res.status(500).json({ err: "internal error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const data = req.body;
    const updatedMenu = await Menu.findByIdAndUpdate(menuId, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }
    res.status(200).json(updatedMenu);
  } catch (err) {
    console.error("Error updating menu:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const deletedMenu = await Menu.findByIdAndDelete(menuId);
    if (!deletedMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }
    res.status(200).json({ Message: "Menu deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:recipeType", async (req, res) => {
  try {
    const recipeType = req.params.recipeType;
    if (recipeType === "Veg" || recipeType === "Non-Veg") {
      const menu = await Menu.find({ type: recipeType });
      res.json(menu);
    }
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
