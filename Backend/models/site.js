const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
    // site name required
    // site incharge -  user serach and select - not required, 
    // org id,
    // status - inwork/inactive/completed, 
    // createdBy - from token required, 
    // locationId - object reference - not required
    // completion percentage - required - 0 default
    // startDate, deadline - project starting date - manual select (calender)
    // path : Array of objects - objects will have {lat, lan} - not required,
    // createdAt, updatedAt
});

module.exports = mongoose.model("Site", siteSchema);
