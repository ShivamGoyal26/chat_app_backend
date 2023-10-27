const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: [{ type: String, required: true }],
    email: [{ type: String, required: true }],
    password: [{ type: String, required: true }],
    pic: [
      {
        type: String,
        required: true,
        default:
          "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
