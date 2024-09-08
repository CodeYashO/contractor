const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default : "employee"
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "expired"],
    default: "pending",
  },
  password: { type: String },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  token: String,
  expiresAt: Date,
});

module.exports = mongoose.model("Invite", inviteSchema);
