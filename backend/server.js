const app = require('./app');
const dotenv = require('dotenv');

//importing mongodb connecting function
const databaseConnect = require('./config/database');

//config
dotenv.config({ path: 'backend/config/config.env' });

//connecting to database
databaseConnect();

app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})