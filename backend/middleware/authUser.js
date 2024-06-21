const User = require("../models/userModel");
const errorHandler = require("../util/errorHandler");
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');

//authenticate user
module.exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new errorHandler('Please login to access this resource', 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();
});

//authorize a user
module.exports.isAuthorizedUser = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler(
                `Role: ${req.user.role} is not authorized to access this resource`, 403
            ));
        }

        next();
    }
};