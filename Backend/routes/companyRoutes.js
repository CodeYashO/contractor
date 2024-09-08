const express = require('express');
const { getAllCompanies, getCompanyById , addcompany} = require('../controllers/companyController');
const router = express.Router();

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.post("/add-company" , addcompany)

module.exports = router;  
  