const ChatMessage = require('../model/chatMessage.js');
const User = require('../model/user.js');
//const  = model.User;
const ObjectId = require('mongoose').Types.ObjectId;
class ChatMessagesController {
    /**
     * [createMessage description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createMessage(req, res) {
        let requestData = req.body;
        let chatMessage = new ChatMessage();
        if (requestData['message'] == undefined) {
            return res.status(422).send(JSON.stringify({
                "hola": "invalid message"
            }));
        }
        if (requestData['user_id'] == undefined) {
            return res.status(422).send(JSON.stringify({
                "hola": "invalid user"
            }));
        }
        let message = requestData['message'];
        let user_id = requestData['user_id'];
        let userFound = null;
        //1. Get user and validate that it exists
        User.findUserById(user_id).then(result => {
            userFound = result;
            console.log(message, userFound._id);
            //2. Create chat message object
            let chatMessage = new ChatMessage(message, userFound._id);
            //3. save chat message
            return chatMessage.createNewMessage();
        }).then(chatMessageCreated => {
            //4. if chat message was saved emit the chat message to everyone
            res.io.emit('new-chat-message', {
                "id": chatMessageCreated,
                "user_id": chatMessageCreated.user_id,
                "message": chatMessageCreated.message,
                "created_at": chatMessageCreated.created_at,
                "username": userFound.username
            });

            //5. return a response
            return res.status(201).send(JSON.stringify({
                "result": "chat message created",
                // "data": {
                //     "id": chatMessageCreated._id,
                //     "user_id": chatMessageCreated.user_id,
                //     "message": chatMessageCreated.message,
                //     "created_at": chatMessageCreated.created_at,
                //     "username": userFound.username
                // }
            }));
        }).catch(err => {
            return res.status(422).send(JSON.stringify({
                "error": err.message
            }));
        });
    }
}
module.exports = ChatMessagesController;