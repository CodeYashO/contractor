const mongoose = require("mongoose");

const simSchema = new mongoose.Schema({
  imeiNo: [{ type: String, required: true }],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

module.exports = mongoose.model("Sim", simSchema);
