const express = require('express');
const {connectMongoDb} = require('./connection.js');
const urlRoute = require("./routes/urlRoutes.js");
const staticRoute = require("./routes/staticRoutes.js");
const userRoute = require("./routes/user.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const {checkForAuthentication} = require("./middlewares/auth.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//connecting Database
connectMongoDb(process.env.DATABASE_URL).then(
    console.log("mongoDb connected")
);

app.set("view engine", "ejs"); //Tells express to use ejs as the view engine
app.set("views", path.resolve("./views")); //This sets the directory where Express will look for the view file

app.use(express.json()); //This is a middleware that parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.urlencoded({extended: true})); //This is a middleware that parses incoming requests with URL-encoded payloads.
app.use(cookieParser()); //Ta middleware that parses cookies attached to the client request object.
app.use(checkForAuthentication);

app.use("/user", userRoute);
app.use("/url", urlRoute);
app.use("/", staticRoute);

app.listen(PORT,()=>{
    console.log("Server has been started at port",`${PORT}`);
});
