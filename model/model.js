const mongoose = require('mongoose');
const database = require('./database');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    name: String,
    last_name: String,
    acknowledgement: Boolean,
    onLine:Boolean
});

const ReservedNameSchema = new Schema({
    name : String
});

const UserSocketSchema = new Schema({
    user_id:String,
    socket_id:String
})

const ChatMessageSchema = new Schema({
    user_id: String,
    message: String,
    status: String
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema );
const Reserved_names = mongoose.model('Reserved_names', ReservedNameSchema );
const User_socket = mongoose.model("User_socket",UserSocketSchema);
const ChatMessages = mongoose.model('Chat_Messages', ChatMessageSchema );

module.exports = {
    UserMongo: User,
    ReservedNamesMongo: Reserved_names,
    UserSocketMongo: User_socket,
    ChatMessagesMongo: ChatMessages
}