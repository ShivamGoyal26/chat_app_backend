const express = require("express");

// files
const { protect } = require("../middlewares/authMiddleware");
const { sendMessage } = require("../controllers/messageController");

const router = express.Router();

router.route("/").post(protect, sendMessage);
// router.route("/:chatId").get(protect, allMessages);

module.exports = router;
