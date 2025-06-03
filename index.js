const express = require('express');
const {connectMongoDb} = require('./connection.js');
const urlRoute = require("./routes/urlRoutes.js");
const staticRoute = require("./routes/staticRoutes.js");
const userRoute = require("./routes/user.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const {restrictToLoggedInUserOnly,checkAuth} = require("./middlewares/auth.js");

const app = express();
const PORT = 3000;

//connecting Database
connectMongoDb("mongodb://127.0.0.1:27017/short-urls").then(
    console.log("mongoDb connected")
);

app.set("view engine", "ejs"); //Tells express to use ejs as the view engine
app.set("views", path.resolve("./views")); //This sets the directory where Express will look for the view file

app.use(express.json()); //This is a middleware that parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.urlencoded({extended: false})); //This is a middleware that parses incoming requests with URL-encoded payloads.
app.use(cookieParser()); //Ta middleware that parses cookies attached to the client request object.

app.use("/url", restrictToLoggedInUserOnly, urlRoute); //
app.use("/",checkAuth, staticRoute);
app.use("/user", userRoute);



app.listen(PORT,()=>{
    console.log("Server has been started at port",`${PORT}`);
});
