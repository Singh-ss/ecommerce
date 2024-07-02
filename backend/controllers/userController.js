const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const errorHandler = require('../util/errorHandler');
const User = require('../models/userModel');
const sendToken = require('../util/sendToken');
const sendEmail = require('../util/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

//register a user
module.exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "Ecommerce/avatars",
        width: 150,
        crop: 'scale'
    })
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
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

//get user details
module.exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user
    });
});

//update password
module.exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');

    const isPasswordCorrect = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordCorrect) {
        return next(new errorHandler('Old password is incorrect.', 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new errorHandler('Password does not match with confirmation password.', 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
})

//update profile
module.exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "Ecommerce/avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});

//get all users --Admin
module.exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        success: true,
        users
    });
});

//get single user details --Admin
module.exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new errorHandler(`User does not exist for this id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    });
})

//update user role --Admin
module.exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const userDetails = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, userDetails, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });
});

//delete a user --Admin
module.exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new errorHandler('User does not exist for the given id.', 404));
    }

    //cloudinary image remove
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});