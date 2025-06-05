const {getUser} = require("../services/auth");


async function checkForAuthentication(req,res,next){
    const userUid = req.cookies?.uid; //Checking for any cookie having user's id.
    req.user = null;    //Setting the user to null
    if(!userUid || userUid == undefined) next(); //If no userUid is found, then move to the next middleware
    try{
        const user = await getUser(userUid); //Getting the user from the database
        req.user = user; //Setting the user to the request object
        next(); //Moving to the next middleware
    }catch(error){
        console.error("Error in checkForAuthentication middleware:", error);
        req.user = null; //Setting the user to null
        next(); //Moving to the next middleware
    }
};

async function restrictTo(req,res,next){
    if(!req.user){ //if user is null then render login page(only for url routes)
        return res.render("login"); 
    }
    return next(); // Allow the request to proceed if user is authenticated
};

/*
async function restrictToLoggedInUserOnly(req,res,next) {
    const userUid = req.cookies?.uid; //Checking for any cookie having user's id.
    if(!userUid) return res.redirect("/login");

    try{
        const user = await getUser(userUid);
        if(!user) return res.redirect("/login");
        req.user = user; //request waale user main ye nyaa waala user daal rhe h
        next();
    }catch(error){
        console.error("Error in auth middleware:", error);
        res.redirect("/login");
    }
};

async function checkAuth(req,res,next){
    const userUid = req.cookies?.uid;
    if(!userUid) {
        req.user = null;
        return next();
    }

    try {
        const user = await getUser(userUid);
        req.user = user;
    } catch (error) {
        console.error("Error in checkAuth middleware:", error);
        req.user = null;
    }
    next();
}
*/

module.exports = {
    checkForAuthentication,
    restrictTo,
};