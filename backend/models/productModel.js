const { json } = require('express');
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name of the product']
    },
    description: {
        type: String,
        required: [true, 'Please enter description of the product']
    },
    price: {
        type: Number,
        required: [true, 'Please enter price of the product'],
        maxLength: [8, 'Price can not exceed 8 characters']
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: [true, 'Please enter stock of the product'],
        maxLength: [4, 'Stock can not exceed 4 characters'],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);