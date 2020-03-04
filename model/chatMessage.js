const ChatMessageModel = require('./model').ChatMessagesMongo;


class ChatMessage{
    constructor(message, user_id, user_status) {
        this._id = null;
        this.message = message;
        this.user_id = user_id;
        this.status = user_status || "UNDEFINED";
    }

    createNewMessage() {
        return new Promise((resolve, reject) => {
            let newChatMessage = new ChatMessageModel({
                message: this.message,
                user_id: this.user_id,
                status: this.status
            });
            newChatMessage.save()
            .then(result => {
                console.log('message created');
                this._id = result.id;
                resolve(newChatMessage);
            })
            .catch(function(err) {
                console.log('message creation failed');
                console.log(err);
                reject(err);
            });
        });
    }

    getChatMessages(){
        return new Promise((resolve, reject) => {

            ChatMessageModel.find({})
                .populate("user_id", ["_id", "username"])
                .then(result => {
                    resolve(result);
                })
                .catch(function(err) {
                    console.log("getChatMessages error: " + err);
                    reject(err);
                });
        });

    }
}
module.exports = ChatMessage;
