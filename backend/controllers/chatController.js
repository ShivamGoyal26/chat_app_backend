const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const fetchUserChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password -email -__v")
      .populate("groupAdmin", "-password -email -__v")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    if (chats) {
      chats = await User.populate(chats, {
        path: "latestMessage.sender",
        select: "name pic",
      });

      return res.status(200).json({
        message: "Here are the chats",
        status: true,
        data: chats,
      });
    } else {
      return res.status(404).json({
        message: "No chats found for this user",
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
        message: "User ID not provided in the request.",
        status: false,
      });
    }

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
      return res.status(400).json({
        message: "User doesn't exist.",
        status: false,
      });
    }

    let existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password -email -__v")
      .populate("latestMessage");

    existingChat = await User.populate(existingChat, {
      path: "latestMessage.sender",
      select: "name pic",
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Here is the chat data.",
        status: true,
        data: existingChat,
      });
    } else {
      // Create a new chat
      const newChatData = {
        chatName: "Sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(newChatData);
      const wholeChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password -email"
      );

      return res.status(201).json({
        message: "Here is the chat data.",
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

const createGroup = asyncHandler(async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!name || !users || !Array.isArray(users) || users.length < 2) {
      return res.status(400).json({
        message:
          "Bad request. Ensure 'name' and 'users' (an array with at least 2 members) are provided in the request body.",
        status: false,
      });
    }

    users.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: [req.user._id],
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password -email -__v")
      .populate("groupAdmin", "-password -email -__v");

    return res.status(201).json({
      message: "Group created successfully!",
      status: true,
      data: fullGroupChat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error. Unable to create the group.",
      status: false,
      error: error.message, // Optionally include the specific error for debugging.
    });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    if (!chatName || !chatId) {
      return res.status(400).json({
        message:
          "Bad request. Ensure 'chatName' and 'ChatID' are provided in the request body.",
        status: false,
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      { new: true }
    )
      .populate("users", "-password -email -__v")
      .populate("groupAdmin", "-password -email -__v");

    if (!updatedChat) {
      return res.status(500).json({
        message: "Chat not found.",
        status: false,
      });
    } else {
      return res.status(200).json({
        message: "Group renamed successfully!",
        status: true,
        data: updatedChat,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error. Unable to create the group.",
      status: false,
      error: error.message, // Optionally include the specific error for debugging.
    });
  }
});

const addUserToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    if (!chatName || !userId) {
      return res.status(400).json({
        message:
          "Bad request. Ensure 'chatName' and 'userId' are provided in the request body.",
        status: false,
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password -email -__v")
      .populate("groupAdmin", "-password -email -__v");

    if (!updatedChat) {
      return res.status(500).json({
        message: "Chat not found.",
        status: false,
      });
    } else {
      return res.status(200).json({
        message: "Member added to group successfully!",
        status: true,
        data: updatedChat,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error. Unable to create the group.",
      status: false,
      error: error.message, // Optionally include the specific error for debugging.
    });
  }
});

const removeUserToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    if (!chatName || !userId) {
      return res.status(400).json({
        message:
          "Bad request. Ensure 'chatName' and 'userId' are provided in the request body.",
        status: false,
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password -email -__v")
      .populate("groupAdmin", "-password -email -__v");

    if (!updatedChat) {
      return res.status(500).json({
        message: "Chat not found.",
        status: false,
      });
    } else {
      return res.status(200).json({
        message: "Member added to group successfully!",
        status: true,
        data: updatedChat,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error. Unable to create the group.",
      status: false,
      error: error.message, // Optionally include the specific error for debugging.
    });
  }
});

module.exports = {
  fetchUserChats,
  createChat,
  createGroup,
  renameGroup,
  addUserToGroup,
  removeUserToGroup,
};
