const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");

router.get("/", wrapasync(async (req, res) => {
    res.render("listpages/home");
}));



module.exports = router;