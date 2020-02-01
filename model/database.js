const mongoose = require('mongoose');

const mongoDBURL = 'mongodb://localhost:27017/esn_sa1';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));

module.exports = mongoose;

