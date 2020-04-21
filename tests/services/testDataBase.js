const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

/**
 * test database set up
 */
class TestDataBase {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        this.server = new MongoMemoryServer();
        this.connection = null;
    }

    /**
   * Start the server and establish a connection
   * @return {Promise<unknown>}
   */
    start() {
        return new Promise((resolve, reject) => {
            this.server.getUri(true).then((url) => {
                resolve(mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}));
            });
        });
    }


    /**
   * Disconnect Mongoose
   * @return {Promise<unknown>}
   */
    stop() {
        return new Promise((resolve, reject) => {
            mongoose.connection.close().then(()=>{
                resolve(this.server.stop());
            });
        });
    }

    /**
   * Clean created collections
   * @return {Promise<void>}
   */
    async cleanup() {
        const promises = [];
        const collections = await mongoose.connection.db.collections();
        collections.forEach((collection) =>{
            collection.remove();
        });
        await Promise.all(promises);
    }
}
module.exports = TestDataBase;

