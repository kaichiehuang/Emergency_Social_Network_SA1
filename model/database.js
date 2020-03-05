const mongoose = require('mongoose');

class Database{

    static async connect(){
        const mongoDBURL = 'mongodb://localhost:27017/esn_sa1';
        mongoose.connect(process.env.MONGODB_URI || mongoDBURL,{useNewUrlParser: true,  useUnifiedTopology: true})
    }
    static async  close(){
        mongoose.connection.close()
    }
}

module.exports = Database;
