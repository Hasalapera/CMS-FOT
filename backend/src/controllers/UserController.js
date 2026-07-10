const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { institutionalId, fullName, email, password, role } = req.body;
    if (!institutionalId || !fullName || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = new User({
      institutionalId,
      fullName,
      email,
      passwordHash,
      role,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUser,
};
