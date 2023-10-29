const asyncHandler = require("express-async-handler");

const { userRegisterSchema, userLoginSchema } = require("../validators/auth");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { error, value } = userRegisterSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation failed. Please check your input.",
        status: false,
        errors: error.details.map((err) => err.message),
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

      return res.status(201).json({
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
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      error: error.message,
    });
  }
});

const authUser = asyncHandler(async (req, res) => {
  try {
    const { error, value } = userLoginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Validation failed. Please check your input.",
        status: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (user && (await user.checkPassword(password))) {
      // If user and password are valid, generate a token
      return res.status(201).json({
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
      message: "Internal server error",
      status: false,
      error: error.message,
    });
  }
});

module.exports = {
  registerUser,
  authUser,
};
