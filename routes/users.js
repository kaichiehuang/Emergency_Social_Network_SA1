var express = require('express');
var router = express.Router();
const UsersController = require(__dirname + '/../controllers/usersController');
var bodyParser = require('body-parser');
const { validateTokenMid } = require('../middleware/tokenServer');
const ChatMsg = require('../model/chat_message.js');

// application/json parser
var jsonParser = bodyParser.json();

// Require controller
var usersController = new UsersController();

/* API Define:
* POST /users
* Content-Type: application/json
* Body:
* {
    "username": "kevin_durant",
    "password": "encrypted password",
    "name": "NAME",
    "last_name": "family name",
    "acknowledgement": false
  }
  * */
router.get('/',  function(req, res, next) {
    // console.log('----- test save chat messsages --------');
    // ChatMsg.saveMsgTest();
    // console.log('----- test get messsage --------');
    // ChatMsg.getMsgTest("KOBE_user_id");
    res.send('404');
});
//post method for creating a user
router.post('/', jsonParser, usersController.createUser);
//put method for updating a user
router.put('/:userId', validateTokenMid, jsonParser, usersController.updateUser);

router.get("/users", validateTokenMid,jsonParser,usersController.getAllUsers)

module.exports = router;