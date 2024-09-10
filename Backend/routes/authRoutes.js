const express = require('express');
const { register, verifyOtp, login, forgotPassword, resetPassword , googleLoginToken , sendInvite , acceptInvite , getInvitedUsersByAdmin} = require('../controllers/authController');
const router = express.Router();
const { verifyToken } = require('../controllers/authController');


router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/googleLoginToken' , googleLoginToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.post('/invite' , sendInvite);
router.post('/accept-invitation/:token' , acceptInvite);
// router.post('/accepted-invited-users' , getInvitedUsersByAdmin);
router.get('/verify-token', verifyToken);

module.exports = router;
 