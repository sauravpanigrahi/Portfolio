const express = require("express");
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const expressError = require("../utils/expressError.js");
const Contact = require("../models/contact.js");
const { contactSchema } = require('../Schema.js');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require("dotenv").config(); 

// Middleware to validate contact data

function validateContact(req, res, next) {
  const { error } = contactSchema.validate(req.body.Contact);
  if (error) {
    return res.status(400).send(error.details);
  }
  next();
}


// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
});

// GET route for the homepage
router.get("/", wrapasync(async (req, res) => {
    res.render("listpages/home");
}));

// GET route for the contact page
router.get("/contact", wrapasync(async (req, res) => {
    res.render("listpages/contact");
}));

// POST route for form submission
router.post("/Form", validateContact, wrapasync(async (req, res) => {
    try {
        console.log("Form submitted with data:", req.body.contact);

        // Log MongoDB connection state
        // console.log("MongoDB connection state:", mongoose.connection.readyState);

        // Ensure MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.warn("MongoDB is not connected. Attempting to save contact anyway...");
        }

        // Create a new contact document
        const newContact = new Contact(req.body.contact);

        // Save contact to the database
        try {
            await newContact.save();
            console.log("Contact saved successfully:", newContact);
        } catch (dbError) {
            console.error("Database save error:", dbError);
            // Handle specific MongoDB errors (e.g., duplicate key error)

            // Handle database errors (e.g., authentication)
            if (dbError.name === 'MongoServerError' && dbError.code === 8000) {
                console.error("Authentication failed when saving contact. Check MongoDB credentials.");
                req.flash("error", "Message could not be saved due to database authentication issues.");
            } else {
                throw dbError; // Re-throw other errors to be caught by the outer try-catch
            }
        }

        // Email options
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.RECEIVER,
            subject: "Contact Form Submission",
            text: `Name: ${req.body.contact.name}\nEmail: ${req.body.contact.email}\nPhone: ${req.body.contact.phone}\nMessage: ${req.body.contact.message}`
        };

        // Attempt to send the email
        try {
            console.log("Attempting to send email...");
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
            req.flash("success", "Your message has been sent successfully!");
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            req.flash("error", "Message saved, but email sending failed.");
        }

        // Redirect back to homepage after the form submission
        res.redirect("/");

    } catch (err) {
        console.error("Form submission error:", err);
        req.flash("error", "Failed to send message. Please try again.");
        res.redirect("/contact");
    }
}));

module.exports = router;
