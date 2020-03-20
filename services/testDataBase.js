const mongoose = require('mongoose');
const {MongoMemoryServer} = require("mongodb-memory-server");



class TestDataBase {

  constructor() {
    this.server =  new MongoMemoryServer();
    this.connection = null;
  }

  /**
   * Start the server and establish a connection
   * @returns {Promise<unknown>}
   */
  start() {
    return new Promise((resolve, reject) => {
      this.server.getUri(true).then(url => {
        resolve(mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }))
      });
    });

  }


  /**
   * Disconnect Mongoose
   * @returns {Promise<unknown>}
   */
  stop() {
    return new Promise((resolve, reject) => {
      mongoose.connection.close().then(()=>{
        resolve(this.server.stop())
      });
    });
  }

  /**
   * Clean created collections
   * @returns {Promise<void>}
   */
  async cleanup() {
    let promises = [];
    const collections = await mongoose.connection.db.collections();
    collections.forEach(collection =>{ collection.remove()});
    await Promise.all(promises);
  }


}
module.exports = TestDataBase;

