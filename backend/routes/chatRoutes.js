const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  fetchUserChats,
  createChat,
  createGroup,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/createchat").post(protect, createChat);
router.route("/alluserchats").get(protect, fetchUserChats);
router.route("/creategroup").post(protect, createGroup);
router.route("/renamegroup").put(protect, renameGroup);
router.route("/adduserstogroup").put(protect, addUserToGroup);
router.route("/removeuserfromgroup").put(protect, removeUserFromGroup);

module.exports = router;
