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
    async createMessage(req, res) {
        const requestData = req.body; let senderUser = null; let receiverUser = null;
        if (requestData['message'] == undefined || requestData['sender_user_id'] == undefined || requestData['receiver_user_id'] == undefined) {
            return res.status(422).send(JSON.stringify({
                msg: 'invalid body'
            }));
        }
        const message = requestData['message']; const sendeUserId = requestData['sender_user_id']; const receiverUserId = requestData['receiver_user_id'];
        senderUser = await User.findUserById(sendeUserId);
        receiverUser = await User.findUserById(receiverUserId);
        try {
            const privateChatMessageCreated = await new PrivateChatMessage(message, sendeUserId, receiverUserId, senderUser.status).createNewMessage();
        } catch(err) {
            return res.status(422).send({
                msg: err
            });
        }

        // emit the chat message to both users using their current list of sockets
        PrivateChatMessagesController.emitToSockets(privateChatMessageCreated, senderUser.sockets, res, senderUser, receiverUser, senderUser.status);
        PrivateChatMessagesController.emitToSockets(privateChatMessageCreated, receiverUser.sockets, res, senderUser, receiverUser, senderUser.status);
        // update message count for receiver
        await receiverUser.changeMessageCount(sendeUserId);
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
    }
    /**
     * Get all the messages of the DB
     * @param req
     * @param res
     */
    async getChatMessages(req, res) {
        const requestData = req.query;
        // validate right data from request body
        if (requestData['sender_user_id'] == undefined || requestData['receiver_user_id'] == undefined) {
            return res.status(422).send(JSON.stringify({
                msg: 'invalid user_id'
            }));
        }
        console.log(this);
        const otherUser = PrivateChatMessagesController.getOtherUser(requestData);
        const user = await User.findUserById(otherUser);
        // Validate the other account user status; if it is inactive, we block the conversation.
        /* istanbul ignore next */
        if (!user.active) {
            return res.status(401).send({});
        } else {
            if (requestData['q'] != undefined && requestData['q'].length != 0) {
                await PrivateChatMessagesController.searchPrivateMessage(requestData, res);
            } else {
                await PrivateChatMessagesController.getAllPrivateMessage(requestData, res);
            }
        }
    }

    /**
     * get other user
     * @param requestData
     */
    static getOtherUser(requestData) {
        let otherUser;
        /* istanbul ignore next */
        if (requestData.tokenUserId === requestData['sender_user_id']) {
            otherUser = requestData['receiver_user_id'];
        } else {
            otherUser = requestData['sender_user_id'];
        }
        return otherUser;
    }

    /**
     * search private message
     * @param requestData
     * @param res
     */
    static async searchPrivateMessage(requestData, res) {
        const query = requestData['q'];
        const page = isNaN(requestData['page']) ? 0 : requestData['page'];
        const pageSize = constants.PAGINATION_NUMBER;
        const privateChatMessage = new PrivateChatMessage();
        const otherUser = PrivateChatMessagesController.getOtherUser(requestData);
        const user = await User.findUserById(otherUser);
        /* istanbul ignore next */
        if (!user.active) {
            res.status(401).send({}).end();
        } else {
            const result = await privateChatMessage.searchChatMessages(requestData['sender_user_id'], requestData['receiver_user_id'], query, page, pageSize);
            res.send(result);
        }
    }

    /**
     * fetch all private message
     * @param requestData
     * @param res
     */
    static async getAllPrivateMessage(requestData, res) {
        const privateChatMessage = new PrivateChatMessage();
        const receiverUser = await User.findUserById(requestData['sender_user_id']);
        const result = await privateChatMessage.getChatMessages(requestData['sender_user_id'], requestData['receiver_user_id']);
        // reset counter for user and messages received from user with id receiver_user_id
        await receiverUser.changeMessageCount(requestData['receiver_user_id'], true);
        res.send(result);
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
        /* istanbul ignore next */
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
            const socketIO = new SocketIO(response.io);
            for (const socketId of sockets.keys()) {
                socketIO.emitMessage('new-private-chat-message', privateMessage, socketId);
                socketIO.emitMessage('user-list-update', '', socketId);
            }
        }
    }
}

module.exports = PrivateChatMessagesController;
