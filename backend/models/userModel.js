import mongoose, { Mongoose } from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
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

export default mongoose.model("User", userSchema);