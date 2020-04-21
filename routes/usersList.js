const express = require('express');
const router = new express.Router();
const UserListController = require(__dirname + '/../controllers/UserListController');
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');

// application/json parser
const jsonParser = bodyParser.json();

const userListController = new UserListController();

// get method to obtain all users
router.get('/', TokenServerClass.validateToken, jsonParser, userListController.updateUserList);


module.exports = router;
