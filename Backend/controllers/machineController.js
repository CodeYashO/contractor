const User = require("../models/User");
const Site = require("../models/Site");
const Organization = require("../models/Company");
const Machine = require("../models/Machine");

// Create Machine
exports.createMachine = async (req, res) => {
  console.log(req.body);
  try {
    const {
      name,
      imeiNo,
      machineIncharge,
      vehicleClass,
      status,
      siteId,
      average,
      maxSpeed,
    } = req.body;
    const { orgId, createdBy } = req.body;

    // Validate machineIncharge exists
    // if (machineIncharge) {
    //   const user = await User.find({ machineIncharge});
    //   if (!user) {
    //     return res.status(400).json({ message: "Machine Incharge not found" });
    //   }
    // }

    // Validate siteId exists
    let site = "";
    if (siteId) {
      site = await Site.find({siteName : siteId , orgId : orgId});
      if (!site) {
        return res.status(400).json({ message: "Site not found" });
      }
    }

    console.log(site);

    const machine = new Machine({
      name,
      imeiNo, 
      machineIncharge,
      vehicleClass,
      status,
      siteId : site._id,
      orgId, 
      average,
      maxSpeed,
      createdBy, 
    });

    console.log(machine)

    await machine.save();
    res.status(201).json({ message: "Machine created successfully", machine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
