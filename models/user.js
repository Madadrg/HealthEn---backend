const mongoose = require("mongoose");
const gravatar = require("gravatar");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for user"],
  },
  email: {
    type: String,
    required: [true, "Set email for user"],
    unique: true,
  },
  phone: {
    type: String,
  },
  favorites: {
    type: Boolean,
    default: false,
  },
  avatarURL: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.avatarURL = gravatar.url(
      this.email,
      { s: "250", d: "identicon" },
      true
    );
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
