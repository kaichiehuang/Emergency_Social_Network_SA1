const PrivateChatMessage = require('../model/privateChatMessage.js');
const User = require('../model/user.js');
const constants = require('../constants');
const SocketIO = require('../utils/SocketIO.js');

/**
 * private message controller
 */
class PrivateChatMessagesController {
    /**
     * [createMessage description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createMessage(req, res) {
        const requestData = req.body;
        let senderUser = null;
        let receiverUser = null;
        // 0. validate right data from request body
        if (requestData['message'] == undefined) {
            console.log("in undefined private message");
            return res.status(422).send(JSON.stringify({
                msg: 'invalid message'
            }));
        }
        if (requestData['sender_user_id'] == undefined) {
            return res.status(422).send(JSON.stringify({
                msg: 'invalid sender_user_id'
            }));
        }
        if (requestData['receiver_user_id'] == undefined) {
            return res.status(422).send(JSON.stringify({
                msg: 'invalid receiver_user_id'
            }));
        }
        // 1. capture request data
        const message = requestData['message'];
        const sendeUserId = requestData['sender_user_id'];
        const receiverUserId = requestData['receiver_user_id'];
        // 2. Get sender user and validate that it exists
        User.findUserById(sendeUserId).then((result) => {
            // save sender
            senderUser = result;
            // 3. Get receiver user and validate that it exists
            return User.findUserById(receiverUserId);
        }).then((result) => {
            // 4. save receiver
            receiverUser = result;
            // 5. Create private chat message object
            const privateChatMessage = new PrivateChatMessage(message, sendeUserId, receiverUserId, senderUser.status);
            // 6. save private chat message
            return privateChatMessage.createNewMessage();
        }).then((privateChatMessageCreated) => {
            // 7. if private chat message was saved emit the chat message to both users using their current list of sockets
            PrivateChatMessagesController.emitToSockets(privateChatMessageCreated, senderUser.sockets, res, senderUser, receiverUser, senderUser.status);
            PrivateChatMessagesController.emitToSockets(privateChatMessageCreated, receiverUser.sockets, res, senderUser, receiverUser, senderUser.status);
            // 8. update message count for receiver
            receiverUser.changeMessageCount(sendeUserId);
            // 9. return a response
            return res.status(201).send({
                result: 'private chat message created',
                data: {
                    'id': privateChatMessageCreated._id.toString(),
                    'sender_user_id': privateChatMessageCreated.sender_user_id,
                    'receiver_user_id': privateChatMessageCreated.receiver_user_id,
                    'message': privateChatMessageCreated.message,
                    'seen_by_receiver': privateChatMessageCreated.seen_by_receiver,
                    'created_at': privateChatMessageCreated.created_at
                }
            });
        }).catch((err) => {
            /* istanbul ignore next */
            console.log(err);
            /* istanbul ignore next */
            return res.status(422).send({
                "msg": err.message
            });
        });
    }
    /**
     * Get all the messages of the DB
     * @param req
     * @param res
     */
    getChatMessages(req, res) {
        const requestData = req.query;
        // 0. validate right data from request body
        if (requestData['sender_user_id'] == undefined) {
            return res.status(422).send(JSON.stringify({
                msg: 'invalid sender_user_id'
            }));
        }
        if (requestData['receiver_user_id'] == undefined) {
            return res.status(422).send(JSON.stringify({
                msg: 'invalid receiver_user_id'
            }));
        }

        let otherUser;
        if (requestData.tokenUserId === requestData['sender_user_id']) {
            otherUser = requestData['receiver_user_id'];
        } else {
            otherUser = requestData['sender_user_id'];
        }

        User.findUserById(otherUser)
            .then((user) => {
                // Validate the other account user status
                // if it is inactive, we block the conversation.
                if (!user.active) {
                    return res.status(401).send({});
                } else {
                    if (requestData['q'] != undefined && requestData['q'].length != 0) {
                        // this is a search request, when q exists
                        searchPrivateMessage(requestData, res);
                    } else {
                        // get all private messages
                        getAllPrivateMessage(requestData, res);
                    }
                }
            });
    }
    /**
     * [emitToSockets description]
     * @param  {[type]} privateChatMessageCreated [description]
     * @param  {[type]} sockets                   [description]
     * @param  {[type]} response                  [description]
     * @param  {[type]} senderUser                [description]
     * @param  {[type]} receiverUser              [description]
     * @param  {[type]} status                    [description]
     * @return {[type]}                           [description]
     */
    static emitToSockets(privateChatMessageCreated, sockets, response, senderUser, receiverUser, status) {
        // 1. iterate the list of sockects and emit the data
        if (sockets != undefined && sockets.size > 0) {
            const privateMessage = {
                'id': privateChatMessageCreated._id,
                'message': privateChatMessageCreated.message,
                'sender_user_id': {
                    '_id': senderUser._id,
                    'username': senderUser.username
                },
                'receiver_user_id': {
                    '_id': receiverUser._id,
                    'username': receiverUser.username
                },
                'created_at': privateChatMessageCreated.created_at,
                'status': status
            };
            /* istanbul ignore next */
            for (const socketId of sockets.keys()) {
                const socketIO = new SocketIO(response.io.to(socketId));
                socketIO.emitMessage('new-private-chat-message', privateMessage);
                socketIO.emitMessage('user-list-update', '');
            }
        }
    }
}

/**
 * search private message
 * @param requestData
 * @param res
 */
function searchPrivateMessage(requestData, res) {
    const query = requestData['q'];
    const page = isNaN(requestData['page']) ? 0 : requestData['page'];
    const pageSize = constants.PAGINATION_NUMBER;
    const privateChatMessage = new PrivateChatMessage();

    let otherUser;
    if (requestData.tokenUserId === requestData['sender_user_id']) {
        otherUser = requestData['receiver_user_id'];
    } else {
        otherUser = requestData['sender_user_id'];
    }
    User.findUserById(otherUser)
        .then((user) => {
            // Validatig the other account user status
            // if it is inactive, we block the conversation.
            if (!user.active) {
                return res.status(401).send({});
            } else {
                privateChatMessage.searchChatMessages(requestData['sender_user_id'], requestData['receiver_user_id'], query, page, pageSize)
                    .then((result) => {
                        res.send(result);
                    }).catch((err) => {
                        return res.status(422).send({
                            error: err.message
                        });
                    });
            }
        }).catch((err) => {
            return res.status(422).send({
                "msg": err.message
            });
        });
}

/**
 * fetch all private message
 * @param requestData
 * @param res
 */
function getAllPrivateMessage(requestData, res) {
    const privateChatMessage = new PrivateChatMessage();
    let receiverUser = null;
    User.findUserById(requestData['sender_user_id']).then((result) => {
        receiverUser = result;
        return privateChatMessage.getChatMessages(requestData['sender_user_id'], requestData['receiver_user_id']);
    }).then((result) => {
        // reset counter for user and messages received from user with id receiver_user_id
        receiverUser.changeMessageCount(requestData['receiver_user_id'], true);
        res.send(result);
    }).catch((err) => {
        /* istanbul ignore next */
        return res.status(422).send(JSON.stringify({
            "msg": err.message
        }));
    });
}
module.exports = PrivateChatMessagesController;
