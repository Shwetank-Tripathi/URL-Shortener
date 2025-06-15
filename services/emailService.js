const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const secret = process.env.HASH_KEY; 

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


async function sendEmail(email,otp) {
    console.log("Sending email to:", email);
    console.log("OTP:", otp);
    console.log("Transporter:", transporter);
    try {
        await transporter.verify();
        console.log('SMTP server is ready to take messages');
        
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "OTP : URL Shortner Service",
            text: `OTP for URL Shortner Service is ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">URL Shortner Service</h2>
                    <p>Your OTP for verification is:</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; color: #4F46E5;">
                        ${otp}
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 5 minutes.</p>
                </div>
            `
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

module.exports = {
    sendEmail
};