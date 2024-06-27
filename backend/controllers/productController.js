const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const errorHandler = require('../util/errorHandler');
const ApiFeatures = require('../util/apiFeatures')

//create a product -- Admin
module.exports.createProduct = catchAsyncErrors(async (req, res) => {
    req.body.createdBy = req.user._id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
})

// get all products
module.exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultsPerPage = 8;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeature.query;
    let filteredProductsCount = products.length;
    apiFeature.pagination(resultsPerPage);
    products = await apiFeature.query.clone();
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultsPerPage,
        filteredProductsCount,
    });
})

//update a product --Admin
module.exports.updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) next(new errorHandler('Product not found', 404));
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    });
});

//delete a product --Admin
module.exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new errorHandler('Product not found', 404));
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
});

//get product details
module.exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new errorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        product
    })
});

//create or update a review
module.exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        createdBy: req.user._id,
        comment,
        rating: Number(rating),
        name: req.user.name
    };

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        rev => rev.createdBy.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        isReviewed.rating = rating;
        isReviewed.comment = comment;
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    });
    product.ratings = avg / product.numOfReviews;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    })
});

//get all reviews
module.exports.getAllreviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new errorHandler('Product does not exist for this id', 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

//delete a review
module.exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new errorHandler('Product does not exist for this id', 404));
    }

    const reviews = product.reviews.filter(rev =>
        rev._id.toString() !== req.query.reviewId.toString()
    );
    const numOfReviews = reviews.length;

    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating;
    });
    const ratings = avg / numOfReviews;

    await product.updateOne({
        reviews,
        numOfReviews,
        ratings
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: 'review deleted successfully'
    });
})