const User = require("../models/User");
const Company = require("../models/Company");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const Invite = require("../models/Invite");

// Register User
exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    country,
    state,
    city,
    contactNumber,
    age,
    email,
    password,
    confirmPassword,
    companyName,
    companyEmail,
    companyAddress,
    numberOfEmployees,
  } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create company
    let company = new Company({
      name: companyName,
      email: companyEmail,
      address: companyAddress,
      numberOfEmployees,
    });
    await company.save();

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create OTP
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 1 day

    let hashedOtp = await bcrypt.hash(otp, 10);

    // Create user
    user = new User({
      firstName,
      lastName,
      dateOfBirth,
      country,
      state,
      city,
      contactNumber,
      age,
      email,
      password: hashedPassword,
      company: [company._id],
      otp: hashedOtp,
      otpExpires,
    });
    await user.save();

    // Send OTP via email
    const message = `Your verification code is ${otp}. It expires in 1 day.`;
    await sendEmail(email, "Email Verification", message);

    res.status(201).json({
      message: "User registered. Check your email for verification code.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or OTP" });

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid otp" });
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // const user = await User.findOne({ email });

    const token = jwt.sign(
      { userId: user._id },
      "helloguysmynameisyashdubeystudent",
      { expiresIn: "1m" }
    );
    res
      .status(200)
      .json({ token, user, message: "Email Verified Successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  console.log(rememberMe);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.emailVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });

    let expiryTimeOfToken = "1m";
    if (rememberMe) {
      expiryTimeOfToken = "1d";
    }

    console.log(expiryTimeOfToken);

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, "helloguysmynameisyashdubeystudent", {
      expiresIn: expiryTimeOfToken,
    });

    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.googleLoginToken = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, "helloguysmynameisyashdubeystudent", {
      expiresIn: "1m",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Create Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // console.log(resetToken);

    // hash the token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    console.log(user.resetPasswordToken);
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 1 day

    await user.save();

    // Send Email
    const resetUrl = `${req.protocol}://localhost:3000/reset-password/${user.resetPasswordToken}`;
    const message = `Reset your password by clicking on the following link: ${resetUrl}`;
    await sendEmail(email, "Password Reset", message);

    res.status(200).json({ message: "Reset password email sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  try {
    // Find user by token and ensure token is not expired
    const user = await User.findOne({
      resetPasswordToken: resetToken, // token in hashed format
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    // console.log(user.password);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ valid: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, "helloguysmynameisyashdubeystudent");
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ valid: false, message: "User not found" });
    }

    res.json({ user: user, valid: true });
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(401)
      .json({ valid: false, message: "Token invalid or expired" });
  }
};

exports.sendInvite = async (req, res) => {
  const { inviteData, useremail } = req.body;
  try {
    const user = await User.findOne({ email: useremail }).populate('company')
    const selectedCompany = user.company.find(company => company._id.toString() === inviteData.companyId);

    if (!selectedCompany) {
      return res.status(400).json({ message: "Selected company is not valid for this user" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const invite = new User({
      email: inviteData.email,
      role: inviteData.role,
      token: hashedToken,
      title : inviteData.title,
      company : inviteData.companyId,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day expiration
    });
    await invite.save();

    const inviteLink = `http://localhost:3000/accept-invitation/${hashedToken}`;
    await sendEmail(
      inviteData.email,
      "Invitation to join",
      `Please accept your invitation: ${inviteLink}`
    );

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Accept invitation
exports.acceptInvite = async (req, res) => {
  const { token } = req.params;
  const { formData } = req.body;
  console.log(req.body);
  console.log(formData);
  console.log(token);
  try {
    const firstName = formData.firstName;
    const lastName = formData.lastName;
    const password = formData.password;
    const contactNumber = formData.contactNumber;

    const user = await User.findOne({
      token: token, // token in hashed format
    });
    console.log(user);
    if (!user || user.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired invitation" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.password = password;
    user.contactNumber = contactNumber;
    user.status = "active";
    user.token = undefined;
    user.expiresAt = undefined;
    user.emailVerified = true;
    await user.save();

    res
      .status(200)
      .json({ message: "Invitation accepted, user registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.getInvitedUsersByAdmin = async (req, res) => {
//   const { email } = req.body;
//   try {
//     // const adminId = req.user._id; // Assuming you are using authentication and have the admin's ID
//     const adminUser = await User.findOne({ email });
//     console.log(adminUser);

//     // if (!adminUser || adminUser.role !== 'admin') {
//     //   return res.status(403).json({ message: 'Access denied.' });
//     // }

//     // Fetch all invites sent by the admin that belong to the same company
//     const invites = await Invite.find({
//       company: { $in: adminUser._id },
//     });

//     res.status(200).json({ invites });
//   } catch (error) {
//     res.status(500).json({ message: error.message }); 
//   }
// };
