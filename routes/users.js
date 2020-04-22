const express = require('express');
const router = new express.Router();
const UsersController = require(__dirname + '/../controllers/usersController');
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
const RBAC = require('../middleware/RBAC');

// application/json parser
const jsonParser = bodyParser.json();
// Require controller
const usersController = new UsersController();


router.delete('/:userId/socket/:socketId', TokenServerClass.validateToken, jsonParser, usersController.deleteSocket);
router.post('/:userId/socket', TokenServerClass.validateToken, jsonParser, usersController.createSocket);
router.put('/:userId', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, usersController.updateUser);

// get method to obtain all users
router.get('/', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, usersController.getUsers);

router.get('/:userId', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, usersController.getUser);
router.get('/:userId/personal-message', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, usersController.getPersonalMessageUser);
// post method for creating a user
router.post('/', jsonParser, usersController.createUser);
// put method for updating a user status
router.put('/:userId/status', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, usersController.updateUser);


module.exports = router;
