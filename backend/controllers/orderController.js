const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const errorHandler = require('../util/errorHandler');

//create new order
module.exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    })
});

//get single order details
module.exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return next(new errorHandler('Order does not exist for this id', 404));
    }
    res.status(200).json({
        success: true,
        order
    });
});

//get logged in user details
module.exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        orders
    });
});

//get all orders --Admin
module.exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

//update or process order --Admin
module.exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new errorHandler('Order does not exist for this id', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new errorHandler('Order is already delivered', 400));
    }

    if (req.body.orderStatus == 'Shipped') {
        order.orderItems.forEach(async o => {
            await updateStock(o.product, o.quantity);
        })
    }

    order.orderStatus = req.body.orderStatus;
    if (order.orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        order
    });
});

// async function to update the stocks for products whose orders have been shipped
async function updateStock(productId, orderQuantity) {
    const product = await Product.findById(productId);
    product.stock -= orderQuantity;
    await product.save({ validateBeforeSave: false });
}

//delete an order --Admin
module.exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new errorHandler('Order does not exist for this id', 404));
    }
    await order.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});