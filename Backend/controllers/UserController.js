const User = require("../models/User");
const express = require("express");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("company");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/users/:userId/companies - Fetch all companies associated with the admin
exports.getUserCompanies = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user and populate the companies
    const user = await User.findById(userId).populate("company"); // Assuming 'companies' is an array of company references in User schema

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ companies: user.company });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to fetch companies", error });
  }
};

exports.getUserByCompanyId = async (req, res) => {
  const { companyId } = req.params;

  try {
    // Find users where the 'companies' array includes the specified company ID
    const users = await User.find({ company: companyId });

    // Check if users exist
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for this company" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

exports.updateAUser = async (req, res) => {
  const { email, firstName, lastName, status, role } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (user) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.status = status;
    user.role = role; 
    await user.save();
    res.status(200).json({ message: "User details updated successfully." });
  } else {
    res.status(404).json({ message: "User not found." });
  }
};

exports.removeUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing user", error });
  }
};
