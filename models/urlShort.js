const { Timestamp } = require("bson");
const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },

    redirectURL: {
        type: String,
        required: true,
    },

    visitHistory: [ {timestamp: {type: Number}} ],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",

    },
},
);


const Url = mongoose.model('urlShort', urlSchema);

module.exports = Url;