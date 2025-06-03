const User = require("../models/user");
const {setUser,getUser} = require("../services/auth");

async function handleUserSignup(req,res){
    const { name, email, password} = req.body;
    const user = await User.findOne({email});
    if(user)
        return res.redirect("/signup?error=User already exists");
    await User.create({
        name, email, password,
    });
    return res.redirect("/login");
}

async function handleUserLogin(req,res){
    const { email, password} = req.body;
    const user = await User.findOne({ email, password });
    if(!user) 
        return res.render("signup", {
            error: "No such User exist",
        });
        
    // Convert Mongoose document to plain object
    //can't pass user object directly because it contains extra properties like _id, __v, etc, so first convert it to plain object.
    const userObject = user.toObject();
    const token = setUser(userObject);//then passing it to setUser function. which will sign the user object and return a JWT token.
    res.cookie("uid",token); //setting the JWT token in the cookie.
    return res.redirect("/");
}

async function handleUserLogout(req,res){
    res.clearCookie("uid");
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
};