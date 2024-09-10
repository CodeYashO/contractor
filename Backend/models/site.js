// const mongoose = require("mongoose");

// const siteSchema = new mongoose.Schema({
//     // site name required
//     // site incharge -  user serach and select - not required,
//     // org id,
//     // status - inwork/inactive/completed,
//     // createdBy - from token required,
//     // locationId - object reference - not required
//     // completion percentage - required - 0 default
//     // startDate, deadline - project starting date - manual select (calender)
//     // path : Array of objects - objects will have {lat, lan} - not required,
//     // createdAt, updatedAt
// });

// module.exports = mongoose.model("Site", siteSchema);

const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
    },
    siteIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    status: {
      type: String,
      enum: ["inwork", "inactive", "completed"],
      default: "inwork",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    path: [
      {
        lat: {
          type: Number,
          required: false,
        },
        lan: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const Site = mongoose.model("Site", siteSchema);
module.exports = Site;
