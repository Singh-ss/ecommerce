const express = require('express');
const app = express();

//router imports
const product = require('./routes/productRouter');
const user = require('./routes/userRouter');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', product);
app.use('/api/v1', user);

//middleware for errors
app.use(errorMiddleware);

module.exports = app;