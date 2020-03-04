const PrivateChatMessageModel = require('./model').PrivateChatMessagesMongo;


class PrivateChatMessage{
    constructor(message, sender_user_id, receiver_user_id) {
        this._id = null;
        this.message = message;
        this.sender_user_id = sender_user_id;
        this.receiver_user_id = receiver_user_id;
    }

    createNewMessage() {
        return new Promise((resolve, reject) => {
            let newChatMessage = new PrivateChatMessageModel({
                message: this.message,
                sender_user_id: this.sender_user_id,
                receiver_user_id: this.receiver_user_id,
            });
            newChatMessage.save()
            .then(result => {
                console.log('private message created');
                this._id = result.id;
                resolve(newChatMessage);
            })
            .catch(function(err) {
                console.log('private message creation failed');
                console.log(err);
                reject(err);
            });
        });
    }

    getChatMessages(){
        return new Promise((resolve, reject) => {

            PrivateChatMessageModel.find({})
                .populate("sender_user_id", ["_id", "username"])
                .populate("receiver_user_id", ["_id", "username"])
                .then(result => {
                    resolve(result);
                })
                .catch(function(err) {
                    console.log("getChatMessages private error: " + err);
                    reject(err);
                });
        });
    }

    emitMessageToUsersInvolver(senderUser, receiverUser){
    }

}
module.exports = PrivateChatMessage;