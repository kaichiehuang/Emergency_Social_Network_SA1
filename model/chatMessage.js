const ChatMessageModel = require('./model').ChatMessagesMongo;
const StopWords = require('../utils/StopWords');
const constants = require('../constants');

/**
 * handle chat message
 */
class ChatMessage {
    /**
     * constructor
     * @param message
     * @param userId
     * @param userStatus
     */
    constructor(message, userId, userStatus) {
        this._id = null;
        this.message = message;
        this.user_id = userId;
        this.status = userStatus || 'UNDEFINED';
    }

    /**
     * Creates a new message
     * @return {[type]} [description]
     */
    createNewMessage() {
        return new Promise((resolve, reject) => {
            // validate for empty announcement
            if (this.message.localeCompare('') == 0) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('Invalid message, cannot be empty');
            }

            const newChatMessage = new ChatMessageModel({
                message: this.message,
                user_id: this.user_id,
                status: this.status
            });
            newChatMessage.save()
                .then((result) => {
                    this._id = result.id;
                    resolve(newChatMessage);
                })
                .catch(function(err) {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }

    /**
     * Gets a list of chat messages without using filters
     * @return {[type]} [description]
     */
    getChatMessages(isAdmin) {
        return new Promise((resolve, reject) => {
            const populateQuery = {
                path: 'user_id',
                select: '_id username reported_spams',
                match: {}
            };
            if (!isAdmin) {
                populateQuery['match']['active'] =true;
            }
            ChatMessageModel.find()
                .populate(populateQuery)
                .then((result) => {
                    resolve(result);
                })
                .catch(function(err) {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }

    /**
     * Gets a list of chat messages with using filters
     * @return {[type]} [description]
     */
    static findMessagesByKeyword(keyword, isAdmin) {
        return new Promise((resolve, reject) => {
            StopWords.removeStopWords(keyword).then((filteredKeyWords) => {
                const populateQuery = {
                    path: 'user_id',
                    select: '_id username reported_spams',
                    match: {}
                };
                if (!isAdmin) {
                    populateQuery['match']['active'] =true;
                }
                ChatMessageModel.find({$text: {$search: filteredKeyWords}})
                    .populate(populateQuery)
                    .sort({created_at: 'asc'})
                    .then((messages) => {
                        resolve(messages);
                    }).catch((err) => {
                        /* istanbul ignore next */
                        reject(err);
                    });
            });
        });
    }

    /**
     * find msg by msg id
     * @param id
     * @returns {Promise<unknown>}
     */
    static findMessageById(id) {
        return new Promise((resolve, reject) => {
            ChatMessageModel.findOne({
                _id: id
            }).exec().then((message) => {
                resolve(message);
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    /**
     * set report spam reporter for current message
     * @param messageId
     * @param reporterUserId
     * @returns {Promise<unknown>}
     */
    static setReportSpam(messageId, reporterUserId) {
        return new Promise((resolve, reject) => {
            ChatMessage.findMessageById(messageId).then((message) => {
                /* istanbul ignore next */
                if (message.reported_spams == undefined) {
                    message.reported_spams = {};
                }
                message.reported_spams.set(reporterUserId, true);
                message.spam = (message.reported_spams.size >= constants.MESSAGE_SPAM_REPORTED_LIMIT);
                return message.save();
            }).then((message) => {
                resolve(message);
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }
}

module.exports = ChatMessage;
