const express = require("express");
const router = express.Router();
const {sendEmail} = require("../services/emailService");

const{handleUserSignup, handleUserLogin, handleUserLogout, handleSendOtp, handleVerifyOtp} = require('../controllers/user');

router.post("/", handleUserSignup);
router.post("/send-otp", handleSendOtp);
router.post("/verify-otp", handleVerifyOtp);
router.post("/login", handleUserLogin);
router.get("/logout", handleUserLogout);

module.exports = router;