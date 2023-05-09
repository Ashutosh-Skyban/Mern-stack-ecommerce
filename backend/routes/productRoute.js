import express from "express";
import myModules from "../controllers/productController.js";

const router = express.Router()

router.route('/product').get(myModules.getAllProducts)
router.route('/product/new').post(myModules.createProduct)
// router.route('/product/:id').get(myModules.getProductDetails)
// router.route('/product/:id').put(myModules.updateProduct)
// router.route('/product/:id').delete(myModules.deleteProduct)
router.route('/product/:id').get(myModules.getProductDetails).put(myModules.updateProduct).delete(myModules.deleteProduct)

export default router;