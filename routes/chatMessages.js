var express = require('express');
var router = express.Router();
const ChatMessagesController = require(__dirname + '/../controllers/ChatMessagesController');
var bodyParser = require('body-parser');
const { validateTokenMid } = require('../middleware/tokenServer');

// application/json parser
var jsonParser = bodyParser.json();

// Require controller
var chatMessagesController = new ChatMessagesController();

router.get('/',  function(req, res, next) {
    res.send('200', {"hola": "GET"});
});

//post method for creating a chat message
router.post('/', validateTokenMid, jsonParser, chatMessagesController.createMessage);

//put method for updating a chat message
// router.put('/:userId', validateTokenMid, jsonParser, chatMessagesController.updateUser);

module.exports = router;