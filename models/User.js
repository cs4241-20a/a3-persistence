const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true
    },
    username: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { strict: false }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
