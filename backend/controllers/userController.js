import ErrorHandler from "../utils/errorhandler.js";
import asyncError from "../middleware/catchAsynceroor.js";
import User from "../models/userModel.js";
import sendToken from "../utils/jwTokens.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// Register a user 

const registerUser = asyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is sample id",
            url: "this is sample url",
        }
    })
    // const token = user.getJWToken();
    sendToken(user, 200, res)

    // res.status(201).json({
    //     success: true,
    //     token,
    // })
})

const loginuser = asyncError(async (req, res, next) => {
    const { email, password } = req.body

    // checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email & password"), 401)
    }
    const isPasswordMatched = await user.comparePassword(password)
    // .then((res) => {
    //     return res;
    // }).catch((error) => {
    //     console.log("there is some error", error);
    // });;
    // console.log('isPasswordMatched', isPasswordMatched);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email & password"), 401)
    }
    // req.user = await user;

    // const token = user.getJWToken();
    sendToken(user, 200, res)
    // res.status(200).json({
    //     success: true,
    //     token,
    // })
})

const logout = asyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logout Successfully"
    })
})

const forgotPassword = asyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("user not Found", 404))
    }
    // get Resetpassword token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/vi/password/reset/${resetToken} `;
    const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n if You not requested this email then, Please ignore it`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Ecommerce Password Recovery',
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password
const resetPassword = asyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 404))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 404))

    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendToken(user, 200, res)

})
// get user details
const getUserDetails = asyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
})
// update user password
const updatePassword = asyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect"), 400)
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 404))

    }
    user.password = req.body.newPassword;
    await user.save()
    sendToken(user, 200, res)
})

// update user details
const updateUserDetails = asyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    // we will add cloudianry later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })
    res.status(200).json({
        success: true,
        user,
    })
})



// get All users --admin
const getAllUsers = asyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
})

// get single users Details --admin
const getSingleUsersDetails = asyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        user,
    })
})

// update user role profile --admin
const updateUserProfile = asyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    // we will add cloudianry later
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })
    res.status(200).json({
        success: true,
        user,
    })
})

// Delete user profile --admin
const deleteUserProfile = asyncError(async (req, res, next) => {
    let user = await User.findById(req.params.id)
    // we will remove cloudnary
    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404))
    }
    user = await User.findByIdAndDelete(req.params.id); res.status(200).json({
        success: true,
        user,
    })
})
export default { registerUser, loginuser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserDetails, getAllUsers, getSingleUsersDetails, updateUserProfile, deleteUserProfile }