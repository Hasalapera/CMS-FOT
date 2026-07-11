const { User } = require("../models/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { institutionalId, password } = req.body;
    if (!institutionalId || !password) {
      return res.status(400).json({ error: "Both fields are required" });
    }
    const user = await User.findOne({
      where: {
        institutionalId,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, institutionalId: user.institutionalId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    user.lastLoginAt = new Date();
    await user.save();
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  changePassword,
};
