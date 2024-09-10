// /controllers/siteController.js
const User = require("../models/User");
const Site = require("../models/Site");

exports.createSite = async (req, res) => {
  const {
    siteName,
    startDate,
    deadline,
    siteIncharge,
    status,
    orgId,
    createdBy,
  } = req.body;

  try {
    // Validate required fields
    if (
      !siteName ||
      !startDate ||
      !deadline ||
      !siteIncharge ||
      !status ||
      !orgId ||
      !createdBy
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Split and clean up the input siteIncharge names
    const inchargeNames = siteIncharge
      .split(",")
      .map((name) => name.trim().toLowerCase());

    // Debugging: Log the names to see if they match what you expect
    console.log("Searching for site incharges with names:", inchargeNames);

    // Find site incharge users based on names provided
    const inchargeUsers = await User.find({
      $or: inchargeNames.map((name) => ({
        $expr: {
          $eq: [
            { $toLower: { $concat: ["$firstName", " ", "$lastName"] } },
            name,
          ],
        },
      })),
    });

    // Check if the users were found correctly
    console.log("Found incharge users:", inchargeUsers);

    // Check if all incharge users were found
    if (inchargeUsers.length !== inchargeNames.length) {
      return res
        .status(404)
        .json({ message: "Some site incharge users not found" });
    }

    // Extract ObjectIds of the incharge users
    const inchargeIds = inchargeUsers.map((user) => user._id);

    // Create new site
    const newSite = new Site({
      siteName,
      startDate,
      deadline,
      siteIncharge: inchargeIds,
      status,
      orgId,
      createdBy,
    });

    // Save site to the database
    const savedSite = await newSite.save();
    res
      .status(201)
      .json({ message: "Site created successfully", site: savedSite });
  } catch (error) {
    console.error("Error creating site:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Route to get all sites
exports.getAllSites = async (req, res) => {
  try {
    const sites = await Site.find().populate("siteIncharge"); // Populate siteIncharge with user details if needed
    res.json({ sites });
  } catch (error) {
    console.error("Error fetching sites:", error);
    res.status(500).json({ message: "Server error" });
  }
};
