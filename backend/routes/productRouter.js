const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllreviews, deleteReview, getAdminProducts } = require('../controllers/productController');
const router = express.Router();
const { isAuthenticatedUser, isAuthorizedUser } = require('../middleware/authUser');

router.route('/products')
    .get(getAllProducts);

router
    .route("/admin/products")
    .get(isAuthenticatedUser, isAuthorizedUser('admin'), getAdminProducts);

router.route('/admin/product/new')
    .post(isAuthenticatedUser, isAuthorizedUser('admin'), createProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, isAuthorizedUser('admin'), updateProduct)
    .delete(isAuthenticatedUser, isAuthorizedUser('admin'), deleteProduct)

router.route('/product/:id')
    .get(getProductDetails);

router.route('/review')
    .put(isAuthenticatedUser, createProductReview)

router.route('/reviews')
    .get(getAllreviews)
    .delete(isAuthenticatedUser, deleteReview);

module.exports = router;