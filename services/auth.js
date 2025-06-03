//This is just a diary that will keep log of user by mapping them 
const jwt = require("jsonwebtoken");
const secret = "Shwetank#123"

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