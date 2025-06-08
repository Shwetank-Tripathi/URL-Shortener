const mongoose = require("mongoose");

async function connectMongoDb(url){
    console.log("Mongo URI:", url);
    return mongoose.connect(url);
}

module.exports = {
    connectMongoDb,
};