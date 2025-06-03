const {getUser} = require("../services/auth");

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
}

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

module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth,
};