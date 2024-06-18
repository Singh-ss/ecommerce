const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');
const errorHandler = require('../util/errorHandler');
const ApiFeatures = require('../util/apiFeatures')

//create a product -- Admin
module.exports.createProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
})

// get all products
module.exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultsPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultsPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount
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