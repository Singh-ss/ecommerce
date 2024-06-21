const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const router = express.Router();
const { isAuthenticatedUser, isAuthorizedUser } = require('../middleware/authUser');

router.route('/products')
    .get(isAuthenticatedUser, getAllProducts);

router.route('/product/new')
    .post(isAuthenticatedUser, isAuthorizedUser('admin'), createProduct);

router.route('/product/:id')
    .put(isAuthenticatedUser, isAuthorizedUser('admin'), updateProduct)
    .delete(isAuthenticatedUser, isAuthorizedUser('admin'), deleteProduct)
    .get(getProductDetails);
module.exports = router;