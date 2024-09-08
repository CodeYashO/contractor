const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  dateOfBirth: { type: Date },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  contactNumber: { type: String },
  age: { type: Number },
  email: { type: String, unique: true },
  password: { type: String },
  title : {type : String},
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "admin",
  }, // 0 - RootUser, 1 - Manager, 2 - Normal User
  status: {
    type: String,
    enum: ["active" , "inactive"],
    default: "active",
  },
  emailVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  token : String,
  expiresAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
