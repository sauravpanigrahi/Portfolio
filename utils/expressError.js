class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = typeof statusCode === 'number' ? statusCode : 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ExpressError;