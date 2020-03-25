const express = require('express');
const router = express.Router();
const UsersController = require(__dirname + '/../controllers/usersController');
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');

// application/json parser
const jsonParser = bodyParser.json();
// Require controller
const usersController = new UsersController();


router.delete('/:userId/socket/:socketId', TokenServerClass.validateToken, jsonParser, usersController.deleteSocket);
router.post('/:userId/socket', TokenServerClass.validateToken, jsonParser, usersController.createSocket);
router.put('/:userId', TokenServerClass.validateToken, jsonParser, usersController.updateUser);

// get method to obtain all users
router.get('/', TokenServerClass.validateToken, jsonParser, usersController.getUsers);

router.get('/:userId', TokenServerClass.validateToken, jsonParser, usersController.getUser);
// post method for creating a user
router.post('/', jsonParser, usersController.createUser);
// put method for updating a user status
router.put('/:userId/status', TokenServerClass.validateToken, jsonParser, usersController.updateUserStatus);


module.exports = router;
