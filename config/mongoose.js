// Import the mongoose library
const mongoose = require('mongoose');
const env = require('./environment');

// Connect to the MongoDB database named 'codeial_development' on the local machine
mongoose.connect(`mongodb://localhost/${env.db}`);
//mongoose.connect('mongodb://localhost/codeial_development', { useNewUrlParser: true, useUnifiedTopology: true });

// Access the mongoose connection object
const db = mongoose.connection;

// Event listener for error handling during the connection process
db.on('error', console.error.bind(console, "Error in connecting to DB!! "));

// Event listener for when the connection to the database is successfully established
db.once("open", function () {
    console.log("Connect to the Database :: MongoDB");
});
