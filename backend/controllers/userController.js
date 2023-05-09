import ErrorHandler from "../utils/errorhandler.js";
import asyncError from "../middleware/catchAsynceroor.js";
import User from "../models/userModel.js";

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
    res.status(201).json({
        success: true,
        user
    })
})

export default { registerUser }