const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const errorHandler = require("../util/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //mongodb cast error handling
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new errorHandler(message, 400);
    }

    //mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
        err = new errorHandler(message, 400);
    }

    //invalid jwt error
    if (err.name === "JsonWebTokenError") {
        const message = 'Json Web Token is invalid, Try again.';
        err = new errorHandler(message, 400);
    }

    //expired jwt error
    if (err.name === "TokenExpiredError") {
        const message = 'Json Web Token has expired, Try again.';
        err = new errorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}