import Jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorhandler.js";
import asyncError from "./catchAsynceroor.js";
import User from "../models/userModel.js";

export const isAuthenticated = asyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resources", 401))
    }
    const decodedData = Jwt.verify(token, process.env.JWT_SECRETE)
    req.user = await User.findById(decodedData.id)
    // console.log('user', req.user, decodedData);
    next();
})

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // console.log(req.user);
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403))
        }
        next()
    }
}


export default { isAuthenticated, authorizeRoles };