var express = require('express');
var router = express.Router();
const UsersController = require(__dirname + '/../controllers/usersController');
var bodyParser = require('body-parser');
const { validateTokenMid } = require('../middleware/tokenServer');


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

//get method to obtain all users
router.get("/", validateTokenMid,jsonParser,usersController.getAllUsers);

//post method for creating a user
router.post('/', jsonParser, usersController.createUser);
//put method for updating a user
router.put('/:userId', validateTokenMid, jsonParser, usersController.updateUser);


module.exports = router;