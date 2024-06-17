const errorHandler = require("../util/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //mongodb cast error handling
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new errorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}