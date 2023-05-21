import express from "express";
import myModules from "../controllers/productController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router()

router.route('/product').get(isAuthenticated, myModules.getAllProducts)
router.route('/admin/product/new').post(isAuthenticated, authorizeRoles("admin"), myModules.createProduct)
router.route('/product/:id').get(myModules.getProductDetails)
// router.route('/product/:id').put(myModules.updateProduct)
// router.route('/product/:id').delete(myModules.deleteProduct)
router.route('/admin/product/:id').put(isAuthenticated, authorizeRoles("admin"), myModules.updateProduct).delete(isAuthenticated, authorizeRoles("admin"), myModules.deleteProduct)

export default router;