const PrivateChatMessage = require('../model/privateChatMessage.js');
const User = require('../model/user.js');
const constants = require('../constants');

class PrivateChatMessagesController {
    /**
     * [createMessage description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createMessage(req, res) {
        let requestData = req.body;
        let senderUser = null;
        let receiverUser = null;
        //0. validate right data from request body
        if (requestData['message'] == undefined) {
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
        //1. capture request data
        let message = requestData['message'];
        let sender_user_id = requestData['sender_user_id'];
        let receiver_user_id = requestData['receiver_user_id'];
        //2. Get sender user and validate that it exists
        User.findUserById(sender_user_id).then(result => {
            //save sender
            senderUser = result;
            //3. Get receiver user and validate that it exists
            return User.findUserById(receiver_user_id);
        }).then(result => {
            //4. save receiver
            receiverUser = result;
            //5. Create private chat message object
            let privateChatMessage = new PrivateChatMessage(message, sender_user_id, receiver_user_id, senderUser.status);
            //6. save private chat message
            return privateChatMessage.createNewMessage();
        }).then(privateChatMessageCreated => {
            //7. if private chat message was saved emit the chat message to both users using their current list of sockets
            PrivateChatMessagesController.emitToSockets(privateChatMessageCreated, senderUser.sockets, res, senderUser, receiverUser, senderUser.status);
            PrivateChatMessagesController.emitToSockets(privateChatMessageCreated, receiverUser.sockets, res, senderUser, receiverUser, senderUser.status);


            //8. update message count for receiver
            User.changeMessageCount(sender_user_id, receiver_user_id, true);

            //9. return a response
            return res.status(201).send({
                result: 'private chat message created',
                data: {
                    "id": privateChatMessageCreated._id.toString(),
                    "sender_user_id": privateChatMessageCreated.sender_user_id,
                    "receiver_user_id": privateChatMessageCreated.receiver_user_id,
                    "message": privateChatMessageCreated.message,
                    "seen_by_receiver": privateChatMessageCreated.seen_by_receiver,
                    "created_at": privateChatMessageCreated.created_at
                }
            });
        }).catch(err => {
            console.log(err);
            return res.status(422).send({
                error: err.message
            });
        });
    }
    /**
     * Get all the messages of the DB
     * @param req
     * @param res
     */
    getChatMessages(req, res) {
        let requestData = req.query;
        let senderUser = null;
        let receiverUser = null;

        //0. validate right data from request body
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

        if (requestData['q'] != undefined && requestData['q'].length != 0) {
            // this is a search request, when q exists
            searchPrivateMessage(requestData, res);
        } else {
            // get all private messages
            getAllPrivateMessage(requestData, res);
        }
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
        //1. iterate the list of sockects and emit the data
        if (sockets != undefined && sockets.size > 0) {
            for (let socketId of sockets.keys()) {
                // console.log('------------' + socketId);
                response.io.to(socketId).emit('new-private-chat-message', {
                    "id": privateChatMessageCreated._id,
                    "message": privateChatMessageCreated.message,
                    "sender_user_id": {
                        "_id": senderUser._id,
                        "username": senderUser.username
                    },
                    "receiver_user_id": {
                        "_id": receiverUser._id,
                        "username": receiverUser.username
                    },
                    "created_at": privateChatMessageCreated.created_at,
                    "status": status
                });
            }
        }
    }
}

function searchPrivateMessage(requestData, res) {
    let query = requestData['q'];
    let page = isNaN(requestData['page']) ? 0 : requestData['page'];
    let pageSize = constants.PAGINATION_NUMBER;
    let privateChatMessage = new PrivateChatMessage();
    privateChatMessage.searchChatMessages(requestData['sender_user_id'], requestData['receiver_user_id'],
        query, page, pageSize)
        .then(result => {
            res.send(result);
        }).catch(err => {
            console.log(err);
            return res.status(422).send({
                error: err.message
            });
    });
}

function getAllPrivateMessage(requestData, res) {
    let privateChatMessage = new PrivateChatMessage();
    privateChatMessage.getChatMessages(requestData['sender_user_id'], requestData['receiver_user_id']).then(result => {
        //reset counter for user and messages received from user with id receiver_user_id
        User.changeMessageCount(requestData['receiver_user_id'], requestData['sender_user_id']);
        res.send(result);
    }).catch(err => {
        return res.status(422).send(JSON.stringify({
            error: err.message
        }));
    });
}



module.exports = PrivateChatMessagesController;
