const express = require('express');
const router = new express.Router();
const ChatMessagesController = require(__dirname + '/../controllers/ChatMessagesController');
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
const RBAC = require('../middleware/RBAC');
// application/json parser
const jsonParser = bodyParser.json();

// Require controller
const chatMessagesController = new ChatMessagesController();


// get method for getting chat messages
router.get('/', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, chatMessagesController.getChatMessages);

// post method for creating a chat message
router.post('/', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, chatMessagesController.createMessage);


// put method for updating a chat message
// router.put('/:userId', validateTokenMid, jsonParser, chatMessagesController.updateUser);


module.exports = router;
