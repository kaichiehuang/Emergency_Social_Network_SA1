const mongoose = require('mongoose');

class Database {
    static connect() {
        const mongoDBURL = 'mongodb://localhost:27017/esn_sa1';
        mongoose.connect(process.env.MONGODB_URI || mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
        }).catch((err) => {
            console.log('Error on start: ' + err.stack);
            process.exit(1);
        });
    }
    static close() {
        mongoose.connection.close();
    }
}

module.exports = Database;
// Bo's atlas mongo db: mongodb+srv://pollyed:cmubest123%2C.%2F@kevin-jd913.mongodb.net/test?retryWrites=true&w=majority