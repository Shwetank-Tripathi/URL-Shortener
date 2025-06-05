//This is just a diary that will keep log of user by mapping them
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

function setUser(user){
    return jwt.sign(user,secret);
}


function getUser(token){
        if(!token) return null;
        try {
            return jwt.verify(token ,secret);
            
        } catch (error) {
            return null;
        }
}

module.exports = {
    setUser,
    getUser,
};