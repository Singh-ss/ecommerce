const mongoose = require('mongoose');
const databaseConnect = () => {
    mongoose.connect(process.env.DB_URI)
        .then((data) => {
            console.log(`Mongodb connected with server: ${data.connection.host}`);
        })
    // .catch((err) => {
    //     console.logr(err);
    // })
}

module.exports = databaseConnect;