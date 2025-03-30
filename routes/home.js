const express = require("express");
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const expressError = require("../utils/expressError.js");
const Contact = require("../models/contact.js");
const { contactSchema } = require('../Schema.js');

// Middleware to validate contact data
const validateContact = (req, res, next) => {
    if (!req.body.contact) {
        return next(new expressError(400, '"contact" is required'));
    }
    const { error } = contactSchema.validate(req.body);
    if (error) {
        console.log("Validation error:", error.details);
        return next(new expressError(400, error.details.map(e => e.message).join(',')));
    }
    next();
};

router.get("/", wrapasync(async(req,res)=>{
    res.render("listpages/home");
}))
router.get("/contact",wrapasync(async(req,res)=>{
    res.render("listpages/contact");
}))
router.post("/Contact", validateContact, wrapasync(async (req, res) => {
    try {
        const newcontact = new Contact(req.body.contact);
        await newcontact.save();
        console.log("Contact saved:", newcontact);
        req.flash("success", "Your message has been sent successfully!");
        res.redirect("/");
    } catch (err) {
        req.flash("error", "Failed to send message. Please try again.");
        res.redirect("/contact");
    }
}));

module.exports = router;