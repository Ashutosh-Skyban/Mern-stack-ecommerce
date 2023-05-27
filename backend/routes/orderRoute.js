import express from "express";
import order from "../controllers/orderController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router()

// router.route('/product').get(isAuthenticated, myModules.getAllProducts)
router.route('/order/new').post(isAuthenticated, order.newOrder);
router.route('/order/:id').get(isAuthenticated, order.getSingleOrder);
router.route('/orders/me').get(isAuthenticated, order.myOrders);
router.route('/admin/orders').get(isAuthenticated, authorizeRoles("admin"), order.getAllorders);
router.route('/admin/order/:id').put(isAuthenticated, authorizeRoles("admin"), order.updateOrder).delete(isAuthenticated, authorizeRoles("admin"), order.deleteOrder);

export default router;