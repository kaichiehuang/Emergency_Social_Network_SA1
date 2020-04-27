const ChatMessage = require('../model/chatMessage.js');
const User = require('../model/user.js');
const constants = require('../constants');
const SocketIO = require('../utils/SocketIO.js');
const Roles = require('../utils/Roles.js');

/**
 * chat message controller
 */
class ChatMessagesController {
    /**
     * [createMessage description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    async createMessage(req, res) {
        const requestData = req.body;
        if (requestData['message'] == undefined || requestData['user_id'] == undefined) {
            return res.status(422).send({'msg': 'Invalid body'});
        }
        const userFound = await User.findUserById(requestData['user_id']);
        if (userFound.spam) {
            return res.send({'spam': true});
        }
        try {
            const chatMessageCreated = await new ChatMessage(requestData['message'], userFound._id, userFound.status).createNewMessage();
        } catch(err) {
            return res.status(422).send({
                msg: err
            });
        }
        const message = ChatMessagesController.constructMsg(chatMessageCreated, userFound);
        new SocketIO(res.io).emitMessage('new-chat-message', message);
        return res.status(201).send(JSON.stringify({
            'result': 'chat message created',
            'data': {
                'id': chatMessageCreated._id,
                'user_id': chatMessageCreated.user_id,
                'message': chatMessageCreated.message,
                'created_at': chatMessageCreated.created_at,
                'username': userFound.username
            }
        }));
    }

    /**
     * construct messge
     * @param chatMessageCreated
     */
    static constructMsg(chatMessageCreated, userFound) {
        return {
            '_id': chatMessageCreated._id,
            'message': chatMessageCreated.message,
            'user_id': {
                '_id': userFound._id,
                'username': userFound.username,
                'reported_spams': userFound.reported_spams
            },
            'created_at': chatMessageCreated.created_at,
            'status': chatMessageCreated.status
        };
    }

    /**
     * Get all the messages of the DB
     * @param req
     * @param res
     */
    async getChatMessages(req, res) {
        const keyword = req.query.q;
        const page = req.query.page; // default = 0
        res.contentType('application/json');
        const user = await User.findUserById(req.tokenUserId);
        if (keyword !== undefined && keyword.length !== 0) {
            const messages = await ChatMessage.findMessagesByKeyword(keyword, Roles.isAdministrator(user.role));
            const msg = messages.slice(page * constants.PAGINATION_NUMBER, page * constants.PAGINATION_NUMBER + constants.PAGINATION_NUMBER);
            return res.status(201).send(JSON.stringify(msg));
        } else {
            const chatMessage = new ChatMessage();
            const messages = await chatMessage.getChatMessages( Roles.isAdministrator(user.role));
            res.status(201).send(JSON.stringify(messages));
        }
    }
}
module.exports = ChatMessagesController;
