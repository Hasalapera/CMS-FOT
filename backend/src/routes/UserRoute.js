const UserController = require("../controllers/UserController");
const verifyToken = require("../middlewares/Authmiddleware");
const express = require("express");
const router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/reset-password", verifyToken, UserController.changePassword);
router.get("/viewusers", UserController.viewUsers);

module.exports = router;
