const PrivateChatMessage = require('../model/privateChatMessage.js');
const User = require('../model/user.js');
//const  = model.User;
const ObjectId = require('mongoose').Types.ObjectId;
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
            let privateChatMessage = new PrivateChatMessage(message, sender_user_id, receiver_user_id);
            //6. save private chat message
            return privateChatMessage.createNewMessage();
        }).then(privateChatMessageCreated => {
            //7. if private chat message was saved emit the chat message to both users using their current list of sockets
            PrivateChatMessagesController.emitToSockets(privateChatMessageCreated, senderUser.sockets, res, senderUser, receiverUser);
            PrivateChatMessagesController.emitToSockets(privateChatMessageCreated, receiverUser.sockets, res, senderUser, receiverUser);

            //8. return a response
            return res.status(201).send(JSON.stringify({
                result: 'private chat message created',
                data: {
                    "id": privateChatMessageCreated._id.toString(),
                    "sender_user_id": privateChatMessageCreated.sender_user_id,
                    "receiver_user_id": privateChatMessageCreated.receiver_user_id,
                    "message": privateChatMessageCreated.message,
                    "seen_by_receiver": privateChatMessageCreated.seen_by_receiver,
                    "created_at": privateChatMessageCreated.created_at
                }
            }));
        }).catch(err => {
            console.log('entered to catch ....');
            return res.status(422).send(JSON.stringify({
                error: err.message
            }));
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

        let privateChatMessage = new PrivateChatMessage();
        privateChatMessage.getChatMessages(requestData['sender_user_id'], requestData['receiver_user_id']).then(result => {
            res.contentType('application/json');
            res.status(201).send(JSON.stringify(result));
        }).catch(err => {
            return res.status(422).send(JSON.stringify({
                error: err.message
            }));
        });
    }
    static emitToSockets(privateChatMessageCreated, sockets, response, senderUser, receiverUser) {
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
                    "created_at": privateChatMessageCreated.created_at
                });
            }
        }
    }
}
module.exports = PrivateChatMessagesController;