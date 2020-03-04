const mongoose = require('mongoose');
//
// const mongoDBURL = 'mongodb://localhost:27017/esn_sa1';
// mongoose.connect(mongoDBURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
//
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'db connection error:'));
//
// module.exports = mongoose;


//import mongoose from 'mongoose'


class Database{

    static async connect(){
        const mongoDBURL = 'mongodb://localhost:27017/esn_sa1';
        mongoose.connect(process.env.MONGODB_URI || mongoDBURL,{useNewUrlParser: true,  useUnifiedTopology: true})
    }
    static async  close(){
        mongoose.connection.close()
    }
}

// export const connect = async () =>
//     mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017')
//
// export const close = async () => mongoose.connection.close()

module.exports = Database;
