import express from "express";
import userModule from "../controllers/userController.js";
const router = express.Router()

router.route('/register').post(userModule.registerUser)


export default router;