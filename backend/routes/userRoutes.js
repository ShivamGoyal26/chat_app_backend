const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/refreshtoken").post(registerUser);
router.route("/findusers").get(protect, allUsers);
router.post("/login", authUser);

module.exports = router;
