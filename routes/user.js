const express = require("express");
const router = express.Router();
const User = require("../models/User");

// get user listing
router.get("/user-list", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, Users: users });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new user
router.post("/create-user", async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = new User({ name, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// frontend should send like this
// {
//     "name": "ritesh shukla",
//     "email": "ritesh.shukla@gmail.com"

// }
