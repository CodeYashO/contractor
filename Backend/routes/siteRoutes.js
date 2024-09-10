// /routes/siteRoutes.js
const express = require("express");
const { createSite , getAllSites } = require("../controllers/siteController");
const router = express.Router();

// Create a new site
router.get("/", getAllSites);
router.post("/create", createSite);

module.exports = router;
 