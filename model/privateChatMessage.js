const PrivateChatMessageModel = require('./model').PrivateChatMessagesMongo;
const StopWords = require('../utils/StopWords');

/**
 * private msg model
 */
class PrivateChatMessage {
    // eslint-disable-next-line require-jsdoc
    constructor(message, senderUserId, receiverUserId, userStatus) {
        this._id = null;
        this.message = message;
        this.senderUserId = senderUserId;
        this.receiverUserId = receiverUserId;
        this.status = userStatus || 'UNDEFINED';
    }

    /**
     * create new msg
     * @returns {Promise<unknown>}
     */
    createNewMessage() {
        return new Promise((resolve, reject) => {
            if (this.senderUserId == this.receiverUserId) {
                /* istanbul ignore next */
                reject('Cannot chat with himself');
            }
            // validate for empty announcement
            if (this.message.localeCompare('') == 0) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('Invalid message, cannot be empty');
            }

            const newChatMessage = new PrivateChatMessageModel({
                message: this.message,
                sender_user_id: this.senderUserId,
                receiver_user_id: this.receiverUserId,
                status: this.status
            });
            newChatMessage.save().then((result) => {
                console.log('private message created');
                this._id = result.id;
                resolve(newChatMessage);
            }).catch(function(err) {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }
    /**
     * [getChatMessages description]
     *
     * @param  {[type]} senderUserId   [description]
     * @param  {[type]} receiverUserId [description]
     * @return {[type]}                  [description]
     */
    getChatMessages(senderUserId, receiverUserId) {
        return new Promise((resolve, reject) => {
            PrivateChatMessageModel.find({
                $or: [
                    {
                        // condition 1
                        'sender_user_id': senderUserId,
                        'receiver_user_id': receiverUserId,
                    },
                    {
                        // condition 2
                        'sender_user_id': receiverUserId,
                        'receiver_user_id': senderUserId
                    }
                ]
            })
                .populate('sender_user_id', ['_id', 'username']).populate('receiver_user_id', ['_id', 'username'])
            // FIXME sort it by time
                .then((results) => {
                    resolve(results);
                }).catch(function(err) {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }

    /**
     *
     * @param senderUserId
     * @param receiverUserId
     * @param query
     * @param page
     * @param pageSize
     * @return {Promise<unknown>}
     */
    searchChatMessages(senderUserId, receiverUserId, query, page, pageSize) {
        return new Promise( (resolve, reject) =>{
            const skipSize = page * pageSize;
            StopWords.removeStopWords(query).then((preprocessedQuery) => {
                console.log('after clean: ' + preprocessedQuery);
                PrivateChatMessageModel.find({
                    $or: [{'sender_user_id': senderUserId, 'receiver_user_id': receiverUserId},
                        {'sender_user_id': receiverUserId, 'receiver_user_id': senderUserId}],
                    $text: {$search: preprocessedQuery}
                })
                    .populate('sender_user_id', ['_id', 'username'])
                    .populate('receiver_user_id', ['_id', 'username'])
                    .sort({created_at: -1})
                    .skip(skipSize).limit(pageSize)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch(function(err) {
                        /* istanbul ignore next */
                        reject(err);
                    });
            });
        });
    }
}
module.exports = PrivateChatMessage;
