const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const errorHandler = require('../util/errorHandler');
const User = require('../models/userModel');
const sendToken = require('../util/sendToken');
const sendEmail = require('../util/sendEmail');
const crypto = require('crypto');

//register a user
module.exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'sample avatar id',
            url: 'sample url'
        }
    });

    sendToken(user, 201, res);
});

//login a user
module.exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorHandler('Please enter both email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new errorHandler('Invalid email or password', 401));
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return next(new errorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

//logut a user
module.exports.logout = (req, res, next) => {
    res.cookie('token', null, {
        httpOnly: true,
        expires: new Date(Date.now())
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

//forgot password
module.exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new errorHandler('User not found', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetLink = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your reset password link is: ${resetLink} \n\nIf you have not requested this message, please ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Ecommerce Password Recovery',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new errorHandler(err.message, 500));
    }
})

//reset password
module.exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new errorHandler('Reset password token is invalid or has expired.', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler('Password does not match with confirmation password', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
});