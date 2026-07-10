const UserController = require("../controllers/UserController");
const express = require("express");
const router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser);

module.exports = router;
