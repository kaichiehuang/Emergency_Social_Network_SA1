const PrivateChatMessageModel = require('./model').PrivateChatMessagesMongo;
const stopwords = require('n-stopwords')(['en']);

class PrivateChatMessage {
    constructor(message, sender_user_id, receiver_user_id, user_status) {
        this._id = null;
        this.message = message;
        this.sender_user_id = sender_user_id;
        this.receiver_user_id = receiver_user_id;
        this.status = user_status || "UNDEFINED";
    }
    createNewMessage() {
        return new Promise((resolve, reject) => {
            let newChatMessage = new PrivateChatMessageModel({
                message: this.message,
                sender_user_id: this.sender_user_id,
                receiver_user_id: this.receiver_user_id,
                status: this.status
            });
            newChatMessage.save().then(result => {
                console.log('private message created');
                this._id = result.id;
                resolve(newChatMessage);
            }).catch(function(err) {
                console.log('private message creation failed');
                console.log(err);
                reject(err);
            });
        });
    }
    /**
     * [getChatMessages description]
     *
     * @param  {[type]} sender_user_id   [description]
     * @param  {[type]} receiver_user_id [description]
     * @return {[type]}                  [description]
     */
    getChatMessages(sender_user_id, receiver_user_id) {
        return new Promise((resolve, reject) => {
            PrivateChatMessageModel.find({
                $or:[
                    {
                        //condition 1
                        "sender_user_id": sender_user_id,
                        "receiver_user_id": receiver_user_id,
                    },
                    {
                        //condition 2
                        "sender_user_id": receiver_user_id,
                        "receiver_user_id": sender_user_id
                    }
                ]
            })
            .populate("sender_user_id", ["_id", "username"]).populate("receiver_user_id", ["_id", "username"])
            //FIXME sort it by time
                .then(results => {
                resolve(results);
            }).catch(function(err) {
                console.log("getChatMessages private error: " + err);
                reject(err);
            });
        });
    }

    /**
     *
     * @param sender_user_id
     * @param receiver_user_id
     * @param query
     * @param page
     * @param pageSize
     * @returns {Promise<unknown>}
     */
    searchChatMessages(sender_user_id, receiver_user_id, query, page, pageSize) {
        return new Promise( (resolve,reject) =>{
            let skipSize = page * pageSize;
            let preprocessedQuery = stopwords.cleanText(query);
            console.log("after clean: " + preprocessedQuery);
            PrivateChatMessageModel.find({
                    $or:[{
                            "sender_user_id": sender_user_id,
                            "receiver_user_id": receiver_user_id,
                        }, {
                            "sender_user_id": receiver_user_id,
                            "receiver_user_id": sender_user_id
                        }],
                    $text: {$search:preprocessedQuery}
                })
                .populate("sender_user_id", ["_id", "username"]).populate("receiver_user_id", ["_id", "username"])
                .sort({created_at: -1})
                .skip(skipSize)
                .limit(pageSize)
                .then(result => {
                    resolve(result);
                })
                .catch(function(err) {
                    console.log("Error getting Private message by query: " + err);
                    reject(err);
                });
        })
    }

    emitMessageToUsersInvolver(senderUser, receiverUser) {}
}
module.exports = PrivateChatMessage;
