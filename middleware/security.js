const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const expressError = require("../utils/expressError.js");

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

function getDefaultOrigins() {
    const port = process.env.PORT || 8000;
  return [
        `http://localhost:${port}`,
        `http://127.0.0.1:${port}`,
    ];
}

const corsOptions = {
    origin(origin, callback) {
        // Same-origin browser requests and server-to-server calls with no Origin header
        if (!origin) {
            return callback(null, true);
        }

        const permitted = allowedOrigins.length > 0 ? allowedOrigins : getDefaultOrigins();

        if (permitted.includes(origin)) {
            return callback(null, true);
        }

        callback(null, false);
    },
    methods: ["GET", "HEAD", "OPTIONS"],
    credentials: true,
};

const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
});

function blockUnknownApiOrigins(req, res, next) {
    if (!req.path.startsWith("/api")) {
        return next();
    }

    const origin = req.get("Origin");
    const referer = req.get("Referer");

    if (!origin && !referer) {
        return next(new expressError("Access denied: missing origin", 403));
    }

    const permitted = allowedOrigins.length > 0 ? allowedOrigins : getDefaultOrigins();
    const requestOrigin = origin || referer;

    const isAllowed = permitted.some((allowed) => requestOrigin.startsWith(allowed));

    if (!isAllowed) {
        return next(new expressError("Access denied: unknown source", 403));
    }

    next();
}

const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: isProduction ? [] : null,
        },
    },
    crossOriginEmbedderPolicy: false,
});

module.exports = {
    corsOptions,
    apiRateLimiter,
    blockUnknownApiOrigins,
    helmetConfig,
    isProduction,
};
