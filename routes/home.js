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
router.post("/Form", validateContact, wrapasync(async (req, res) => {
    try {
        console.log("Form submitted with data:", req.body.contact);
        const newcontact = new Contact(req.body.contact);
        await newcontact.save();
        console.log("Contact saved:", newcontact);
       
        const mailOption={
            from:process.env.EMAIL,
            to:process.env.RECEIVER,
            subject:"Contact Form Submission",
            text:`Name: ${req.body.contact.name}\nEmail: ${req.body.contact.email}\nPhone: ${req.body.contact.phone}\nMessage: ${req.body.contact.message}`
        };
        try {
            console.log("Attempting to send email...");
            console.log("From:", process.env.EMAIL);
            console.log("To:", process.env.RECEIVER);
            console.log("Using transporter:", {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL
                }
            });
            await transporter.sendMail(mailOption);
            console.log("Email sent successfully");
            req.flash("success", "Your message has been sent successfully!");
        } catch (emailError) {
            console.error("Detailed email error:", {
                message: emailError.message,
                code: emailError.code,
                command: emailError.command,
                response: emailError.response,
                responseCode: emailError.responseCode,
                stack: emailError.stack
            });
            req.flash("error", "Message saved, but email sending failed.");
        }

        res.redirect("/");

    } catch (err) {
        console.error("Form submission error:", {
            message: err.message,
            stack: err.stack
        });
        req.flash("error", "Failed to send message. Please try again.");
        res.redirect("/contact");
    }
}));

module.exports = router;