var express = require('express');
var router = express.Router();
const PrivateChatMessagesController = require(__dirname + '/../controllers/PrivateChatMessagesController');
var bodyParser = require('body-parser');
const { validateTokenMid } = require('../middleware/tokenServer');

// application/json parser
var jsonParser = bodyParser.json();

// Require controller
var privateChatMessagesController = new PrivateChatMessagesController();


//get method for getting chat messages
router.get('/', validateTokenMid, jsonParser, privateChatMessagesController.getChatMessages);

//post method for creating a chat message
router.post('/', validateTokenMid, jsonParser, privateChatMessagesController.createMessage);


//put method for updating a chat message
// router.put('/:userId', validateTokenMid, jsonParser, chatMessagesController.updateUser);

module.exports = router;