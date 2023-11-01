const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  fetchUserChats,
  createChat,
  createGroup,
  renameGroup,
  addUserToGroup,
  removeUserToGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/createchat").post(protect, createChat);
router.route("/alluserchats").get(protect, fetchUserChats);
router.route("/creategroup").post(protect, createGroup);
router.route("/renamegroup").put(protect, renameGroup);
router.route("/addusertogroup").put(protect, addUserToGroup);
router.route("/removeusertogroup ").put(protect, removeUserToGroup);

module.exports = router;
