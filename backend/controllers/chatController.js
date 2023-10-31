const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const fetchUserChats = asyncHandler(async (req, res) => {
  try {
    const { error, value } = assetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
        status: false,
      });
    }
    const { key } = value;
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command, {
      // expiresIn: 20 // this will expire after 20 sec
    });
    if (url) {
      return res.status(200).json({
        message: "success",
        status: true,
        url: url,
      });
    } else {
      return res.status(404).json({
        message: "Image not found",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({
        message: "user id not send check the request",
        status: false,
      });
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [{ users: { $elemMatch: { $eq: req.user._id } } }],
      $and: [{ users: { $elemMatch: { $eq: userId } } }],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic",
    });

    if (isChat?.length > 0) {
      return res.status(200).json({
        message: "here is the chat data",
        status: true,
        data: isChat[0],
      });
    } else {
      // create a new chat
      var chatData = {
        chatName: "Sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const wholeChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).json({
        message: "here is the chat data",
        status: true,
        data: wholeChat,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

module.exports = { fetchUserChats, createChat };
