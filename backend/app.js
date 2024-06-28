const express = require('express');
const app = express();

const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//router imports
const product = require('./routes/productRouter');
const user = require('./routes/userRouter');
const order = require('./routes/orderRouter');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);

//middleware for errors
app.use(errorMiddleware);

module.exports = app;