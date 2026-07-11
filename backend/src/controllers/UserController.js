const { User } = require("../models/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createUser = async (req, res) => {
  try {
    const { institutionalId, fullName, email, password, role } = req.body;
    if (!institutionalId || !fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingUser = await User.findOne({
      where: {
        institutionalId,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this institutional ID already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      institutionalId,
      fullName,
      email,
      passwordHash,
      role,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { institutionalId, password } = req.body;
    if (!institutionalId || !password) {
      return res.status(400).json({ message: "Both fields are required" });
    }
    const user = await User.findOne({
      where: {
        institutionalId,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Ensure the user object has a password hash to compare.
    if (!user.passwordHash) {
        console.error(`User with ID ${user.id} has no password hash.`);
        return res.status(500).json({ message: "Server configuration error: User account is not set up correctly." });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        institutionalId: user.institutionalId,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    user.lastLoginAt = new Date();
    await user.save();
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
};
