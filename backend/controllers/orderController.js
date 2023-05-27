import asyncError from "../middleware/catchAsynceroor.js";
import Order from "../models/orderModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import Product from "../models/productModels.js";


//Create new Order
const newOrder = asyncError(async (req, res, next) => {
    const {
        shippingInfo,
        ordrItems,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    } = req.body;
    const order = await Order.create(
        {
            shippingInfo,
            ordrItems,
            paymentInfo,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        }
    );
    res.status(201).json({
        success: true,
        order
    })
})

//  get Single order Details

const getSingleOrder = asyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404))
    }

    res.status(201).json({
        success: true,
        order
    })
})

//  get logged in users all orders Details

const myOrders = asyncError(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    res.status(201).json({
        success: true,
        orders
    })
})

// get all orders --admin

const getAllorders = asyncError(async (req, res, next) => {

    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    });

    res.status(201).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update order status --admin

const updateOrder = asyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404))
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 404))
    }
    order.ordrItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity)
    })

    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.delivereAt = Date.now()
    }
    await order.save({ validateBeforeSave: false })
    res.status(201).json({
        success: true,

    })
})

const updateStock = async (id, quantity) => {
    const product = await Product.findById(id)
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false })

}


// delete order --admin
const deleteOrder = asyncError(async (req, res, next) => {

    let order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404))
    }
    order = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Order Deleted successfully",
        order,
    });
})
export default { newOrder, getSingleOrder, myOrders, getAllorders, updateOrder, deleteOrder };