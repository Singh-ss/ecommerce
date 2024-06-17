const Product = require('../models/productModel')

//create a product -- Admin
module.exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
}

// get all products
module.exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    });
}

//update a product --Admin
module.exports.updateProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({
            success: false,
            message: "Product not found"
        })
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
}

//delete a product --Admin
module.exports.deleteProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({
            success: false,
            message: "product not found"
        })
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
}

//get product details
module.exports.getProductDetails = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({
            success: false,
            message: "product not found"
        })
    }
    res.status(200).json({
        success: true,
        product
    })
}