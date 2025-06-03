const express = require("express");
const router = express.Router();

const {handleGetShortId, handleGetIdAndGenerateLink, handleGetAnalytics,handledeleteRequest, handleView} = require("../controllers/shortUrl")

router.post("/visit",handleGetShortId);
router.get("/view",handleView);
router.get("/visit/:shortId",handleGetIdAndGenerateLink);
router.get("/analytics/:shortId", handleGetAnalytics);
router.delete("/delete/:shortId",handledeleteRequest);

module.exports = router;