// /routes/siteRoutes.js
const express = require("express");
const {createMachine} = require("../controllers/machineController");
const router = express.Router();

// Create a new Machine
router.post('/create' , createMachine);

module.exports = router;