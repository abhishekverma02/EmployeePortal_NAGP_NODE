const mongoose = require('mongoose');

function connectToDatabase(dbURL){
    mongoose.connect(dbURL, {useNewUrlParser: true});
    const connection = mongoose.connection;

    connection.on('error', console.error.bind(console, 'mongoDB connection error:'));
}

module.exports = {connectToDatabase}