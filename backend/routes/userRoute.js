import express from "express";
import userModule from "../controllers/userController.js";
import auth from "../middleware/auth.js";
const router = express.Router()

router.route('/register').post(userModule.registerUser)
router.route('/login').post(userModule.loginuser)
router.route('/password/forgot').post(userModule.forgotPassword)
router.route('/password/reset/:token').put(userModule.resetPassword)
router.route('/logout').get(userModule.logout)
router.route('/me').get(auth.isAuthenticated, userModule.getUserDetails)
router.route('/password/update').put(auth.isAuthenticated, userModule.updatePassword)
router.route('/me/update').put(auth.isAuthenticated, userModule.updateUserDetails)

// admin routes
router.route('/admin/users').get(auth.isAuthenticated, auth.authorizeRoles("admin"), userModule.getAllUsers)
router.route('/admin/user/:id').get(auth.isAuthenticated, auth.authorizeRoles("admin"), userModule.getSingleUsersDetails).put(auth.isAuthenticated, auth.authorizeRoles("admin"), userModule.updateUserProfile).delete(auth.isAuthenticated, auth.authorizeRoles("admin"), userModule.deleteUserProfile)


export default router;