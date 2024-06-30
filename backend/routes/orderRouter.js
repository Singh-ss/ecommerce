const express = require('express');
const { newOrder, getSingleOrder, myOrders, updateOrder, deleteOrder, getAllOrders } = require('../controllers/orderController');
const { isAuthenticatedUser, isAuthorizedUser } = require('../middleware/authUser');
const router = express.Router();

router.route('/order/new')
    .post(isAuthenticatedUser, newOrder);

router.route('/order/:id')
    .get(isAuthenticatedUser, getSingleOrder);

router.route('/orders/me')
    .get(isAuthenticatedUser, myOrders);

router.route('/admin/orders')
    .get(isAuthenticatedUser, isAuthorizedUser('admin'), getAllOrders);

router.route('/admin/order/:id')
    .put(isAuthenticatedUser, isAuthorizedUser('admin'), updateOrder)
    .delete(isAuthenticatedUser, isAuthorizedUser('admin'), deleteOrder);


module.exports = router;