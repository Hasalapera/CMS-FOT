const User = require("../models/User");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
  try {
    const { institutionalId, fullName, email, password, role } = req.body;
    if (!institutionalId || !fullName || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existingUser = await User.findOne({
      where: {
        institutionalId,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this institutional ID already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      institutionalId,
      fullName,
      email,
      passwordHash,
      role,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUser,
};
