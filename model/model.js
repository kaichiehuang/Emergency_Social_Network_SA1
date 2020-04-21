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
        phone_number: String,
        address: String,
        city: String,
        birth_date: {
            type: String,
            default: '1900-09-28'
        },
        sockets: {
            type: Map,
            of: Boolean
        },
        unread_messages: {
            type: Map,
            of: Number
        },
        personal_message:{
            message: String,
            security_question: String,
            security_question_answer: String
        },
        medical_information:{
            blood_type: String,
            allergies: String,
            prescribed_drugs: String,
            privacy_terms_medical_accepted: Boolean,
        },
        emergency_contact:{
            name: String,
            phone_number: String,
            address: String,
            email: String
        },
        privacy_terms_data_accepted: Boolean,
        reported_spams: {
            type: Map,
            of: Boolean
        },
        spam: Boolean,
        active: {
            type: Boolean, 
            default: true
        },
        role: String
        
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
        status: String,
        reported_spams: {
            type: Map,
            of: Boolean
        },
        spam: Boolean
    },
    schemaOptions
);

ChatMessageSchema.index({'message': 'text'});

const EmergencyStatusDetailSchema = new Schema(
    {
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        status_description: String,
        share_location: String,


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

const SpamReportSchema = new Schema(
    {
        level: String,
        type: String,
        description: String
    },
    schemaOptions
);


const ResourceSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    resource_type:{
        type: String,
        enum : ['SUPPLIES','MEDICAL','SHELTER'],
    },
    name:String,
    location:String,
    image:{ data: Buffer, contentType: String },
    description:String,
    question_one:Boolean,
    question_two:Boolean,
    question_three:Boolean,
    },
    schemaOptions
);

const User = mongoose.model('User', UserSchema);
const Reserved_names = mongoose.model('Reserved_names', ReservedNameSchema);
const ChatMessages = mongoose.model('Chat_Messages', ChatMessageSchema);
const PrivateChatMessages = mongoose.model('Private_Chat_Messages', PrivateChatMessageSchema);
const Announcements= mongoose.model('Announcement', AnnouncementSchema);
const Resources= mongoose.model('Resource', ResourceSchema);
const EmergencyStatusDetail = mongoose.model('Emergency_Status_Detail', EmergencyStatusDetailSchema);
const PictureAndDescription = mongoose.model('Pictures_and_Description', PictureAndDescriptionSchema);
const SpamReport = mongoose.model("Spam_Report", SpamReportSchema);

module.exports = {
    UserMongo: User,
    ReservedNamesMongo: Reserved_names,
    ChatMessagesMongo: ChatMessages,
    PrivateChatMessagesMongo: PrivateChatMessages,
    AnnouncementsMongo: Announcements,
    ResourcesMongo:Resources,
    EmergencyStatusDetailMongo: EmergencyStatusDetail,
    PictureAndDescriptionMongo: PictureAndDescription,
    SpamReportMongo: SpamReport
};
