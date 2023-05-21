import mongoose, { Mongoose } from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed more than 30 char"],
        minLength: [4, "Name Should Have more than 4 char"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Valid Email"]

    },
    password: {
        type: String,
        required: [true, "Please Enter Your password"],
        minLength: [8, "password Should Have more than 8 char"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },

    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs.hash(this.password, 10)
})


// Jwt token

userSchema.methods.getJWToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRETE, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// compare password

userSchema.methods.comparePassword = async function (enteredPassword) {

    return await bcryptjs.compare(enteredPassword, this.password)

}

// Generating Password Reset Token

userSchema.methods.getResetPasswordToken = function () {
    // Generating Token

    const resetToken = crypto.randomBytes(20).toString("hex")
    //Hashing and adding  resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

export default mongoose.model("User", userSchema);