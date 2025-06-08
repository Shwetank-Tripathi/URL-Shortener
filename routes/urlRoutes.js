const express = require("express");
const router = express.Router();
const {restrictTo} = require("../middlewares/auth.js"); 

const {handleGetShortId, handleGetIdAndGenerateLink, handleGetAnalytics,handledeleteRequest, handleView} = require("../controllers/shortUrl")

router.post("/visit",restrictTo,handleGetShortId);
router.get("/view",restrictTo,handleView);
router.get("/visit/:shortId",handleGetIdAndGenerateLink);
router.get("/analytics/:shortId", restrictTo, handleGetAnalytics);
router.delete("/delete/:shortId", restrictTo, handledeleteRequest);

module.exports = router;