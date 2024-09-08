const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String },
    address: { type: String},
    numberOfEmployees: { type: Number},
});
 
const Company = mongoose.model('Company', companySchema);
module.exports = Company;
 