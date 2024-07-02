const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const errorHandler = require('../util/errorHandler');
const ApiFeatures = require('../util/apiFeatures')
const cloudinary = require('cloudinary');

//create a product -- Admin
module.exports.createProduct = catchAsyncErrors(async (req, res) => {
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "Ecommerce/products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;

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

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

//update a product --Admin
module.exports.updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) next(new errorHandler('Product not found', 404));

    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

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

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
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
    const product = await Product.findById(req.query.id);
    console.log(req.query.id);
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
        rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating;
    });
    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
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