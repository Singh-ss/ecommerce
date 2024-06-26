const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllreviews, deleteReview } = require('../controllers/productController');
const router = express.Router();
const { isAuthenticatedUser, isAuthorizedUser } = require('../middleware/authUser');

router.route('/products')
    .get(getAllProducts);

router.route('/admin/product/new')
    .post(isAuthenticatedUser, isAuthorizedUser('admin'), createProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, isAuthorizedUser('admin'), updateProduct)
    .delete(isAuthenticatedUser, isAuthorizedUser('admin'), deleteProduct)

router.route('/product/:id')
    .get(getProductDetails);

router.route('/review')
    .put(isAuthenticatedUser, createProductReview)
    .delete(isAuthenticatedUser, deleteReview);

router.route('/reviews')
    .get(getAllreviews);

module.exports = router;