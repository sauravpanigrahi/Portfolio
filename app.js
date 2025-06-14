// Load environment variables only in non-production environments
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); // Load environment variables from .env file
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const expressError = require('./utils/expressError.js'); // Custom error handler
const flash = require('connect-flash'); 
const session = require('express-session'); 
const MongoStore = require('connect-mongo');
const cors = require("cors");
const homeRouter = require("./routes/home.js"); // Assuming this route is correctly defined
const nodemailer = require('nodemailer'); // For sending emails if required

const app = express();
const port = 8000;

// Set MongoDB connection string
let dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/portfolio"; // Fallback to local DB

// Log the raw connection string (with credentials redacted)
// console.log("Raw MongoDB connection string (redacted):", dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

// Ensure MongoDB connection string is valid
if (dbUrl && !dbUrl.startsWith('mongodb://') && !dbUrl.startsWith('mongodb+srv://')) {
    // console.error("Invalid MongoDB connection string format. It should start with 'mongodb://' or 'mongodb+srv://'");
    dbUrl = "mongodb://127.0.0.1:27017/portfolio"; // Fallback
}

main()
    .then(() => console.log("Database connected"))
    .catch(err => {
        console.error("Database connection error:", err);
        console.log("Using fallback connection or continuing without database connection");
    });

async function main() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(dbUrl);
        console.log("MongoDB connection successful!");
    } catch (err) {
        console.error("Mongoose connection error:", err);
        throw err; // Handle errors at higher level
    }
}

// Session configuration
let sessionOptions = {
    secret: process.env.SECRET || "defaultsecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// Add MongoDB session store if the connection is successful
if (dbUrl && (dbUrl.startsWith('mongodb://') || dbUrl.startsWith('mongodb+srv://'))) {
    try {
        sessionOptions.store = MongoStore.create({ mongoUrl: dbUrl });
        console.log("MongoDB session store created successfully");
    } catch (err) {
        console.error("Error creating MongoDB session store:", err);
        console.log("Using memory session store instead");
    }
}

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session(sessionOptions)); 
app.use(flash()); 

// Flash message setup
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Use homeRouter for all home-related routes
app.use("/", homeRouter);

// 404 Error handling
app.all("*", (req, res, next) => {
    next(new expressError("Page not found", 404));
});

// General error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    
    // Ensure statusCode is a valid number
    const validStatusCode = typeof statusCode === 'number' ? statusCode : 500;
    
    console.error("Error details:", {
        message: message,
        statusCode: validStatusCode,
        stack: err.stack
    });
    
    if (!res.headersSent) {
        res.status(validStatusCode).render('listpages/error', { msg: message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
