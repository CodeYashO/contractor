const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
    // name - required
    // imeiNo - objectId- not required (select)
    // machineIncharge - user object id searchable - (select)
    // vehicleClass - light/medium/heavy (select)
    // status - active/inactive/maintainance (select)
    // siteId - object id - not required (select)
    // orgId - objectId (jo create ker raha hai uske org ka id)
    // average - number km/litre
    // maxSpeed - in number - km/her required
    // createdBy - user object id from token
    // createdAt, updatedAt
});

module.exports = mongoose.model("Machine", siteSchema);
