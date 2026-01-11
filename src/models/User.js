const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },

  otpHash: String,
  otpExpiredAt: Date,
  isVerified: { type: Boolean, default: false },
},
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
