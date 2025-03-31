const express = require("express");
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const expressError = require("../utils/expressError.js");
const Contact = require("../models/contact.js");
const { contactSchema } = require('../Schema.js');
const nodemailer=require('nodemailer');//nodemailer is used to send the email  

require("dotenv").config(); 



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

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    },
});


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
       
        const mailOption={
            from:process.env.EMAIL,
            to:process.env.RECEIVER,
            subject:"Contact Form Submission",
            text:`Name: ${req.body.contact.name}\nEmail: ${req.body.contact.email}\nMessage: ${req.body.contact.message}`
        };
        try {
            await transporter.sendMail(mailOption);
            console.log("Email sent successfully");
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            req.flash("error", "Message saved, but email sending failed.");
        }

        req.flash("success", "Your message has been sent successfully!");
        res.redirect("/");

    } catch (err) {
        req.flash("error", "Failed to send message. Please try again.");
        res.redirect("/contact");
    }
}));

module.exports = router;