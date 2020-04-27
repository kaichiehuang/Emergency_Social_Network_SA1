const mongoose = require('mongoose');

/**
 * db set up
 */
class Database {
    // eslint-disable-next-line require-jsdoc
    static connect() {
        const mongoDBURL = 'mongodb://localhost:27017/esn_sa1';
        mongoose.connect(process.env.MONGODB_URI || mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
        }).catch((err) => {
            process.exit(1);
        });
    }
    // eslint-disable-next-line require-jsdoc
    static close() {
        mongoose.connection.close();
    }
}

module.exports = Database;
