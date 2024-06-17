const express = require('express');
const app = express();

app.use(express.json());

//router imports
const product = require('./routes/productRouter');
const errorMiddleware = require('./middleware/error');

app.use('/api/v1', product);
app.use(errorMiddleware)

module.exports = app;