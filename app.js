// Load environment variables only in non-production environments
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const expressError = require("./utils/expressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const homeRouter = require("./routes/home.js");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;

// ----------------------
// DATABASE CONNECTION
// ----------------------
let dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/portfolio";

// Validate URL format
if (dbUrl && !dbUrl.startsWith("mongodb://") && !dbUrl.startsWith("mongodb+srv://")) {
    console.log("Invalid DB URL, switching to local");
    dbUrl = "mongodb://127.0.0.1:27017/portfolio";
}

async function connectDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(dbUrl);
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        console.log("⚠ Using fallback / continuing without DB connection");
    }
}

connectDB();

// ----------------------
// SESSION CONFIGURATION
// ----------------------
let sessionOptions = {
    secret: process.env.SECRET || "defaultsecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};

// Use MongoDB session store ONLY if Atlas/local DB URL is valid
try {
    sessionOptions.store = MongoStore.create({ mongoUrl: dbUrl });
    console.log("MongoDB session store created successfully");
} catch (err) {
    console.error("Session store error:", err.message);
    console.log("⚠ Falling back to in-memory session store");
}

// ----------------------
// APP SETTINGS & MIDDLEWARE
// ----------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session(sessionOptions));
app.use(flash());

// Flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ----------------------
// ROUTES
// ----------------------
app.use("/", homeRouter);

// ----------------------
// 404 HANDLER
// ----------------------
app.all("*", (req, res, next) => {
    next(new expressError("Page not found", 404));
});

// ----------------------
// GLOBAL ERROR HANDLER
// ----------------------
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // console.error("🔥 SERVER ERROR:", {
    //     message: err.message,
    //     statusCode,
    //     stack: err.stack,
    // });

    if (!res.headersSent) {
        res.status(statusCode).render("listpages/error", { msg: err.message });
    }
});

// ----------------------
// START SERVER
// ----------------------
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
