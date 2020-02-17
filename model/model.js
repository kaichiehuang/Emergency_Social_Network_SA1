const mongoose = require('mongoose');
const database = require('./database');
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
};


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

const ChatMessagesSchema = new Schema({
    message : String,
    user_id : String
}, schemaOptions);

const User = mongoose.model('User', UserSchema );
const Reserved_names = mongoose.model('Reserved_names', ReservedNameSchema );
const ChatMessage = mongoose.model('Chat_messages', ChatMessagesSchema );

module.exports = {
    UserMongo: User,
    ChatMessage: ChatMessage,
    ReservedNamesMongo: Reserved_names,
}