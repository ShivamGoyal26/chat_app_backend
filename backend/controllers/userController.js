const asyncHandler = require("express-async-handler");

const { userRegisterSchema, userLoginSchema } = require("../validators/auth");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { error, value } = userRegisterSchema.validate(req.body);

    console.log(error);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
        status: false,
      });
    }

    const { name, email, password, pic } = value;

    // Check if the user already exists
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        message:
          "User with this email already exists. Please use a different email.",
        status: false,
      });
    }

    // Create the user
    const user = await User.create(value);

    if (user) {
      let userData = {
        id: user._id,
        pic: user.pic,
        email: user.email,
        name: user.name,
        token: generateToken(user._id),
      };

      return res.status(200).json({
        data: userData,
        status: true,
        message: "Registration successful",
      });
    } else {
      return res.status(400).json({
        message: "Failed to register. Please try again later.",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

const authUser = asyncHandler(async (req, res) => {
  try {
    const { error, value } = userLoginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
        status: false,
      });
    }

    const { email, password } = value;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (user && (await user.checkPassword(password))) {
      // If user and password are valid, generate a token
      return res.status(200).json({
        data: {
          id: user._id,
          pic: user.pic,
          email: user.email,
          name: user.name,
          token: generateToken(user._id),
        },
        status: true,
        message: "Login successful",
      });
    } else {
      return res.status(400).json({
        message: "invalid credentials",
        status: false,
      });
    }
  } catch (error) {
    console.log("not Success");
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

const allUsers = asyncHandler(async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const limit = parseInt(req.query.limit) || 10; // Results per page, default to 10

    if (!searchQuery) {
      return res.status(400).json({
        message: "No search query provided.",
        status: false,
      });
    }

    const searchRegex = new RegExp(searchQuery, "i");

    const keyword = {
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ],
    };

    const totalUsers = await User.countDocuments(keyword);

    const users = await User.find(keyword)
      .select("-password -__v -email")
      .find({ _id: { $ne: req.user._id } })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      message: "List of users",
      status: true,
      data: users,
      page,
      pages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.log("Not Success");
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  refreshToken,
};
