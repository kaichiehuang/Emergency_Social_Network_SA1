var express = require('express');
var router = express.Router();
var UserListController = require(__dirname + '/../controllers/UserListController');
var bodyParser = require('body-parser');
const TokenServerClass = require("../middleware/TokenServer")

// application/json parser
var jsonParser = bodyParser.json();

var userListController = new UserListController();

//get method to obtain all users
router.get("/", TokenServerClass.validateToken,jsonParser,userListController.updateUserList);


module.exports = router
