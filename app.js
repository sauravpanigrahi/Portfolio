// Load environment variables only in non-production environments
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const homeRouter = require("./routes/home.js");
const {
    corsOptions,
    apiRateLimiter,
    blockUnknownApiOrigins,
    helmetConfig,
    isProduction,
} = require("./middleware/security.js");

const app = express();
const port = process.env.PORT || 8000;

if (!process.env.SECRET && isProduction) {
    throw new Error("SECRET environment variable is required in production");
}

const sessionOptions = {
    secret: process.env.SECRET || "dev-only-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.disable("x-powered-by");

app.use(helmetConfig);
app.use(apiRateLimiter);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(require("cors")(corsOptions));
app.use(blockUnknownApiOrigins);
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", homeRouter);

app.all("*", (req, res, next) => {
    next(new expressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (!res.headersSent) {
        if (req.path.startsWith("/api")) {
            return res.status(statusCode).json({ error: err.message });
        }
        res.status(statusCode).render("listpages/error", { msg: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
