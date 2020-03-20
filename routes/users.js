var express = require('express');
var router = express.Router();
const UsersController = require(__dirname + '/../controllers/usersController');
var bodyParser = require('body-parser');
const {
    validateTokenMid
} = require('../middleware/tokenServer');
// application/json parser
var jsonParser = bodyParser.json();
// Require controller
var usersController = new UsersController();


router.delete('/:userId/socket/:socketId', validateTokenMid, jsonParser, usersController.deleteSocket);
router.post('/:userId/socket', validateTokenMid, jsonParser, usersController.createSocket);
router.put('/:userId', validateTokenMid, jsonParser, usersController.updateUser);

//get method to obtain all users
router.get('/', validateTokenMid, jsonParser, usersController.getUsers);

router.get('/:userId', validateTokenMid, jsonParser, usersController.getUser);
//post method for creating a user
router.post('/', jsonParser, usersController.createUser);
//put method for updating a user status
router.put('/:userId/status', validateTokenMid, jsonParser, usersController.updateUserStatus);


module.exports = router;
