const expressAsyncHandler = require("express-async-handler");

// Files
const Message = require("../models/MessageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({
      message: "chatId not provided in the request.",
      status: false,
    });
  }

  if (!content) {
    return res.status(400).json({
      message: "Message not provided.",
      status: false,
    });
  }

  const chatExists = await Chat.exists({ _id: chatId });

  if (!chatExists) {
    return res.status(404).json({
      message: "Chat not found.",
      status: false,
    });
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    return res.status(200).json({
      message: "Message sent Successful",
      status: true,
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

const allMessages = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.query;

  if (!chatId) {
    return res.status(400).json({
      message: "chatId not provided in the request.",
      status: false,
    });
  }

  const chatExists = await Chat.exists({ _id: chatId });

  if (!chatExists) {
    return res.status(404).json({
      message: "Chat not found.",
      status: false,
    });
  }

  try {
    let message = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .select("-__v")
      .populate("chat")
      .sort({ createdAt: "desc" });

    return res.status(200).json({
      message: "Messages Fetched!",
      status: true,
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

module.exports = {
  sendMessage,
  allMessages,
};
