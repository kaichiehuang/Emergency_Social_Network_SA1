const ChatMessageModel = require('./model').ChatMessagesMongo;
const tokenMiddleWare = require('../middleware/tokenServer');


class ChatMessage {
    constructor(user_id, message, status) {
        this.user_id = user_id;
        this.message = message;
        this.status = status;
    }

    //TODO delete this, test success by BO
    static getMsgTest(KOBE_user_id) {
        return new Promise((resolve, reject) => {
            console.log(KOBE_user_id);
            ChatMessageModel.findOne({
                user_id: KOBE_user_id
            }).exec().then(message => {
                console.log(message);
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    };

    //TODO delete this, test success by BO
    static saveMsgTest() {
        let chatMsg = new ChatMessageModel({
            user_id: 'KOBE_user_id',
            message: 'PLS help me!',
            status: 'DANGER'
        });
        return chatMsg.save();
    }

}
module.exports = ChatMessage;