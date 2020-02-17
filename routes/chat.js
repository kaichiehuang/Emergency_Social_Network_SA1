var express = require('express');
var router = express.Router();
const ChatMessageController = require(__dirname + '/../controllers/chatMessageController');
var bodyParser = require('body-parser');
const { validateTokenMid } = require('../middleware/tokenServer');


// application/json parser
var jsonParser = bodyParser.json();

// Require controller
var chatMessageController = new ChatMessageController();

router.get('/',  function(req, res, next) {
  res.send('404');
});

router.put("/:userId",validateTokenMid,chatMessageController.connectUser);

router.post("/message",validateTokenMid,chatMessageController.sendMessage);


module.exports = router;