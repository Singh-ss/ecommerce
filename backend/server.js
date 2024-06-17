const app = require('./app');
const dotenv = require('dotenv');

//uncaught error exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1);
})

//importing mongodb connecting function
const databaseConnect = require('./config/database');

//config
dotenv.config({ path: 'backend/config/config.env' });

//connecting to database
databaseConnect();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})

//unhandled promise rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');

    server.close(() => {
        process.exit(1);
    });
});