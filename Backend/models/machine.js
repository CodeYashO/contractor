// const mongoose = require("mongoose");

// const machineSchema = new mongoose.Schema({
//     // name - required
//     // imeiNo - objectId- not required (select)
//     // machineIncharge - user object id searchable - (select)
//     // vehicleClass - light/medium/heavy (select)
//     // status - active/inactive/maintainance (select)
//     // siteId - object id - not required (select)
//     // orgId - objectId (jo create ker raha hai uske org ka id)
//     // average - number km/litre
//     // maxSpeed - in number - km/her required
//     // createdBy - user object id from token
//     // createdAt, updatedAt
// });

// module.exports = mongoose.model("Machine", siteSchema);

const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imeiNo: {
      type: String,
      required: true,
    },
    machineIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleClass: {
      type: String,
      enum: ["light", "medium", "heavy"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      required: true,
    },
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      default: null,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    average: {
      type: Number,
      default: null,
    },
    maxSpeed: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Machine = mongoose.model("Machine", machineSchema);
module.exports = Machine;
