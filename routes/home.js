const express = require("express");
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const expressError = require("../utils/expressError.js");


require("dotenv").config(); 

// GET route for the homepage
router.get("/", wrapasync(async (req, res) => {
    res.render("listpages/home");
}));



module.exports = router;