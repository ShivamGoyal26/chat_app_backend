const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { fetchUserChats, createChat } = require("../controllers/chatController");

const router = express.Router();

// router.route("/alluserchats").get(protect, fetchUserChats);
// router.route("/creategroup").post(protect, fetchUserChats);
router.route("/createchat").post(protect, createChat);
// router.route("/renamechat").put(protect, fetchUserChats);
// router.route("/groupremove ").put(protect, fetchUserChats);
// router.route("/groupadd ").put(protect, fetchUserChats);

module.exports = router;
