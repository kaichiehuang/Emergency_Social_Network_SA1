const mongoose = require('mongoose');
const database = require('./database');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    name: String,
    last_name: String,
    acknowledgement: Boolean
});

const ReservedNameSchema = new Schema({
    name : String
});

const User = mongoose.model('User', UserSchema );
const ReservedName = mongoose.model('ReservedName', ReservedNameSchema );

module.exports = {
    UserMongo: User,
    ReservedNamesMongo: ReservedName
}