const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "Token not provided",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(401).json({
          status: false,
          message: "Invalid token",
        });
      }

      // Check if the user associated with the token exists
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          status: false,
          message: "User not found",
        });
      }

      // Store the user data in the request for further use
      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: error.message,
      });
    }
  } else {
    return res.status(401).json({
      status: false,
      message: "No authorization header provided",
    });
  }
});

module.exports = { protect };
