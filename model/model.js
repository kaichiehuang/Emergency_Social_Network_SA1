const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

const UserSchema = new Schema(
    {
        username: String,
        password: String,
        name: String,
        last_name: String,
        acknowledgement: Boolean,
        onLine: Boolean,
        status: String,
        sockets: {
            type: Map,
            of: Boolean
        }
    },
    schemaOptions
);

const ReservedNameSchema = new Schema({
    name: String
});

const UserSocketSchema = new Schema(
    {
        user_id: String,
        socket_id: String
    },
    schemaOptions
);

const ChatMessageSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        message: String,
        status: String
    },
    schemaOptions
);

const PrivateChatMessageSchema = new Schema(
    {
        sender_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        receiver_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        message: String,
        seen_by_receiver: {
            type: Boolean,
            default: 0
        },
        status: String
    },
    schemaOptions
);

const User = mongoose.model('User', UserSchema);
const Reserved_names = mongoose.model('Reserved_names', ReservedNameSchema);
const User_socket = mongoose.model('User_socket', UserSocketSchema);
const ChatMessages = mongoose.model('Chat_Messages', ChatMessageSchema);
const PrivateChatMessages = mongoose.model(
    'Private_Chat_Messages',
    PrivateChatMessageSchema
);

module.exports = {
    UserMongo: User,
    ReservedNamesMongo: Reserved_names,
    UserSocketMongo: User_socket,
    ChatMessagesMongo: ChatMessages,
    PrivateChatMessagesMongo: PrivateChatMessages
};
