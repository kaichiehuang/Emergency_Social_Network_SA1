const ChatMessage = require('../model/chatMessage.js');
const User = require('../model/user.js');
const constants = require('../constants');

class ChatMessagesController {
    /**
     * [createMessage description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createMessage(req, res) {
        const requestData = req.body;
        if (requestData['message'] == undefined) {
            return res.status(422).send(JSON.stringify({
                'hola': 'invalid message'
            }));
        }
        if (requestData['user_id'] == undefined) {
            return res.status(422).send(JSON.stringify({
                'hola': 'invalid user'
            }));
        }
        const message = requestData['message'];
        const user_id = requestData['user_id'];
        let userFound = null;
        // 1. Get user and validate that it exists
        User.findUserById(user_id).then((result) => {
            userFound = result;
            // 2. Create chat message object
            const chatMessage = new ChatMessage(message, userFound._id, userFound.status);
            // 3. save chat message
            return chatMessage.createNewMessage();
        }).then((chatMessageCreated) => {
            // 4. if chat message was saved emit the chat message to everyone
            res.io.emit('new-chat-message', {
                'id': chatMessageCreated._id,
                'message': chatMessageCreated.message,
                'user_id': {
                    '_id': userFound._id,
                    'username': userFound.username
                },
                'created_at': chatMessageCreated.created_at,
                'status': chatMessageCreated.status
            });

            // 5. return a response
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
        }).catch((err) => {
            return res.status(422).send(JSON.stringify({
                'error': err.message
            }));
        });
    }

    /**
     * Get all the messages of the DB
     * @param req
     * @param res
     */
    getChatMessages(req, res) {
        const chatMessage = new ChatMessage();
        const keyword = req.query.q;
        const page = req.query.page; // default = 0
        // When a keyword is specified
        if (keyword !== undefined && keyword.length !== 0) {
            // search keyword
            ChatMessage.findMessagesByKeyword(keyword)
                .then( (messages) => {
                    // get specific page of 10 messages
                    const msg = messages.slice(page * constants.PAGINATION_NUMBER, page * constants.PAGINATION_NUMBER + constants.PAGINATION_NUMBER);
                    res.contentType('application/json');
                    return res.status(201).send(JSON.stringify(msg));
                })
                .catch( (err) => {
                    console.log('Error searching messages by keyword');
                    return res.status(500).send(err);
                });
        } else {
            // If no keyword or status is specified
            chatMessage.getChatMessages()
                .then((result) => {
                    res.contentType('application/json');
                    res.status(201).send(JSON.stringify(result));
                }).catch((err) => {
                    return res.status(422).send(JSON.stringify({
                        'error': err.message
                    }));
                });
        }
    }
}
module.exports = ChatMessagesController;
