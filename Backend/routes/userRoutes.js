const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/:id', userController.getUser);
router.get("/:userId/companies" , userController.getUserCompanies);
router.get("/company/:companyId" , userController.getUserByCompanyId);
router.post('/update', userController.updateAUser);
router.post('/remove', userController.removeUser);

module.exports = router;   