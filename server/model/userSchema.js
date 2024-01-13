const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    googleId: {
      type: String,
      required: [true, "Add the googleId"],
    },
    username: {
      type: String,
      required: [true, "Add the username"],
    },
    email: {
      type: String,
      required: [true, "Add the user email"],
      unique: [true, "Email already exist"],
    },
    image: {
      type: String,
      required: [false, "Add the user password"],
    },
    isAdmin: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
