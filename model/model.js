const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
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
        status_timestamp: Date,
        sockets: {
            type: Map,
            of: Boolean
        },
        unread_messages: {
            type: Map,
            of: Number
        }
    },
    schemaOptions
);

const ReservedNameSchema = new Schema({
    name: String
});


const ChatMessageSchema = new Schema(
    {
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        message: String,
        status: String
    },
    schemaOptions
);

ChatMessageSchema.index({'message': 'text'});

const EmergencyStatusDetailSchema = new Schema(
    {
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        status_description: String,
        share_location: Boolean,


    },
    schemaOptions
);

const PictureAndDescriptionSchema = new Schema(
    {
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        picture_description: String,
        picture_path: String,
        picture_name: String
    },
    schemaOptions
);


const PrivateChatMessageSchema = new Schema(
    {
        sender_user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        receiver_user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        message: String,
        seen_by_receiver: {
            type: Boolean,
            default: 0
        },
        status: String
    },
    schemaOptions
);

PrivateChatMessageSchema.index({'message': 'text'});

const AnnouncementSchema = new Schema(
    {
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        message: String,
        status: String
    },
    schemaOptions
);

AnnouncementSchema.index({'message': 'text'});

const User = mongoose.model('User', UserSchema);
const Reserved_names = mongoose.model('Reserved_names', ReservedNameSchema);
const ChatMessages = mongoose.model('Chat_Messages', ChatMessageSchema);
const PrivateChatMessages = mongoose.model('Private_Chat_Messages', PrivateChatMessageSchema);
const Announcements= mongoose.model('Announcement', AnnouncementSchema);
const EmergencyStatusDetail = mongoose.model('Emergency_Status_Detail', EmergencyStatusDetailSchema);
const PictureAndDescription = mongoose.model('Pictures_and_Description', PictureAndDescriptionSchema);

module.exports = {
    UserMongo: User,
    ReservedNamesMongo: Reserved_names,
    ChatMessagesMongo: ChatMessages,
    PrivateChatMessagesMongo: PrivateChatMessages,
    AnnouncementsMongo: Announcements,
    EmergencyStatusDetailMongo: EmergencyStatusDetail,
    PictureAndDescriptionMongo: PictureAndDescription
};
