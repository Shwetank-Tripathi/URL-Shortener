const User = require("../models/user");
const {setUser,getUser} = require("../services/auth");
const crypto = require("crypto");
const {sendEmail} = require("../services/emailService");

const secret = process.env.HASH_KEY;

async function handleSendOtp(req, res) {
    try{
        const {email,text} = req.body;
        const lowerEmail = email.toLowerCase();
        const user = await User.findOne({email: lowerEmail});

        if(user && text==="signup"){
            return res.status(400).json({ message: "User already exists" });
        }
        else if((!user && text==="resetpassword")){
            return res.status(400).json({ message: "User doesnot exists" });
        }
        else if((!user && text==="signup") || (user && text==="resetpassword") ){
            const otp = Math.floor(100000 + Math.random() * 900000);
            await sendEmail(lowerEmail,otp);
            const hashOTP = crypto.createHmac("sha256", secret).update(otp.toString()).digest("hex");
            res.status(200).cookie("otp", hashOTP, { httpOnly: true, secure: true, maxAge: 300000 }).json({ message: "OTP sent successfully" });
        }
    }catch(error){
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP" });
    }
}

async function handleVerifyOtp(req, res) {
    try{
        const {otp: submittedOTP} = req.body;
        const storedOTP = req.cookies.otp;
        if(!storedOTP){
            return res.status(400).json({ message: "OTP not found" });
        }
        const hashOTP = crypto.createHmac("sha256", secret).update(submittedOTP).digest("hex");
        if(hashOTP !== storedOTP){
            return res.status(400).json({ message: "Invalid OTP" });
        }
        res.clearCookie("otp");
        return res.status(200).json({ message: "OTP verified successfully" });
    }catch(error){
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
}

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        const lowerEmail = email.toLowerCase();
        const hashPassword = crypto.createHmac("sha256", secret).update(password).digest("hex");
        await User.create({ name, email: lowerEmail, password: hashPassword });
        return res.redirect("/login");
        } catch (error) {
            console.error("Signup error:", error);
            // return res.render("signup", {
            //     error: "Signup failed. Please try again."
            // });
            return res.status(500).json({error:"Signup failed. Please try again."});
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        const lowerEmail = email.toLowerCase();
        const hashPassword = crypto.createHmac("sha256", secret).update(password).digest("hex");
        console.log(hashPassword);
        const user = await User.findOne({ email: lowerEmail, password: hashPassword });
        
        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = setUser(user.toObject());
        res.cookie("uid", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed. Please try again." });
    }
}

async function handleUserLogout(req, res) {
    res.clearCookie("uid");
    return res.redirect("/");
}

async function handlePasswordReset(req, res) {
    try{
        const {email, password} = req.body;
        const lowerEmail = email.toLowerCase();
        const hashPassword = crypto.createHmac("sha256", secret).update(password).digest("hex");
        await User.updateOne({email: lowerEmail}, {password: hashPassword});
        res.clearCookie("uid");
        return res.status(200).json({message: "Password reset successfully. Redirecting to login..."});
    }catch(error){
        console.error("Password reset error:", error);
        return res.status(500).json({message: "Password reset failed. Please try again."});
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
    handleSendOtp,
    handleVerifyOtp,
    handlePasswordReset
};