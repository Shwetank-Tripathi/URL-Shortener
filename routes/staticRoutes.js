const express = require("express");
const router = express.Router();
const URL = require("../models/urlShort");

router.get("/", async(req,res)=>{
    if(!req.user){
        return res.render("home", {
            user: null
        });
    }

    try {
        const allurls = await URL.find({createdBy: req.user._id});
        return res.render("home", {
            user: req.user,
            urls: allurls
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.render("home", {
            user: req.user,
            urls: []
        });
    }
});

router.get("/signup", (req,res) =>{
    return res.render("signup", {
        error: req.query.error
    });
});

router.get("/login",(req,res)=>{
    return res.render("login");
});

router.get("/forgotpassword",(req,res)=>{
    return res.render("forgotpassword");
})

module.exports = router;