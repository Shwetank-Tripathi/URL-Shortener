const express = require("express");
const router = express.Router();

const{handleUserSignup, handleUserLogin, handleUserLogout, handleSendOtp, handleVerifyOtp, handlePasswordReset} = require('../controllers/user');

router.post("/", handleUserSignup);
router.post("/send-otp", handleSendOtp);
router.post("/verify-otp", handleVerifyOtp);
router.post("/login", handleUserLogin);
router.get("/logout", handleUserLogout);
router.patch("/reset-password", handlePasswordReset);

module.exports = router;