// import required modules/packages
const express = require("express");

// router instance
const router = express.Router();

// app endpoints
router.get("/posts/test", (req, res)=>{
    res.status(200).send("Test route handler working");
});

// export router instance
module.exports = router;