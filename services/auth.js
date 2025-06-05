//This is just a diary that will keep log of user by mapping them
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

function setUser(user) {
    try {
        return jwt.sign(user, secret);
    } catch (error) {
        console.error("Error signing JWT:", error);
        return null;
    }
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};