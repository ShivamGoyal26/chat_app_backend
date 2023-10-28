const express = require("express");

const { registerUser } = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(registerUser);
// router.post("/login", authUser);

module.exports = router;
