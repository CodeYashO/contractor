const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  } 
};

// Get a single company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/companies - Add a new company and reference it in the user by user email
exports.addcompany = async (req, res) => {
  const { name, companyEmail, address, employees, userEmail } = req.body; // userEmail is provided in the form
  console.log(name , companyEmail , address , employees , userEmail);
  try {
    // Create the new company
    const newCompany = new Company({
      name,
      email: companyEmail, // Company email
      address,
      numberOfEmployees : employees,
    });

    // Save the company
    const savedCompany = await newCompany.save();

    // Find the user by their email and update their companies array
    const user = await User.findOneAndUpdate(
      { email: userEmail }, // Find user by their email
      { $push: { company : savedCompany._id } }, // Add the company ID to user's companies array
      { new: true, useFindAndModify: false }
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided email' });
    }

    res.status(201).json({ message: 'Company added and referenced to user successfully', company: savedCompany });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to add company', error });
  }
}

