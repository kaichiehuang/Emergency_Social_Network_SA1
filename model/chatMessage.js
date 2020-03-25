const ChatMessageModel = require('./model').ChatMessagesMongo;
const StopWords = require('../utils/StopWords');

class ChatMessage {

    constructor(message, user_id, user_status) {
        this._id = null;
        this.message = message;
        this.user_id = user_id;
        this.status = user_status || "UNDEFINED";
    }

    /**
     * Creates a new message
     * @return {[type]} [description]
     */
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
                .catch(function (err) {
                    console.log('message creation failed');
                    console.log(err);
                    reject(err);
                });
        });
    }

    /**
     * Gets a list of chat messages without using filters
     * @return {[type]} [description]
     */
    getChatMessages() {
        return new Promise((resolve, reject) => {

            ChatMessageModel.find({})
                .populate("user_id", ["_id", "username"])
                .then(result => {
                    resolve(result);
                })
                .catch(function (err) {
                    console.log("getChatMessages error: " + err);
                    reject(err);
                });
        });
    }

    /**
     * Gets a list of chat messages with using filters
     * @return {[type]} [description]
     */
    static findMessagesByKeyword(keyword) {
        return new Promise((resolve, reject) => {
            StopWords.removeStopWords(keyword).then(filteredKeyWords => {
                ChatMessageModel.find({$text: {$search: filteredKeyWords}})
                    .sort({created_at: 'asc'})
                    .then(messages => {
                        resolve(messages);
                    }).catch(err => {
                    reject(err);
                });
            })
        });
    }


}

module.exports = ChatMessage;
