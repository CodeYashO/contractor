// /routes/siteRoutes.js
const express = require("express");
const { createSite , getAllSites , getAllSitesByOrganaization} = require("../controllers/siteController");
const router = express.Router();

// Create a new site
router.get("/", getAllSites);
router.get("/company/:orgId", getAllSitesByOrganaization);
router.post("/create", createSite);

module.exports = router;
 