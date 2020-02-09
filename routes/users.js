var express = require('express');
var router = express.Router();
const UsersController = require(__dirname + '/../controllers/usersController');
var bodyParser = require('body-parser');

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
    res.send('404');
});
//post method for receiving the data
router.post('/', jsonParser, usersController.createUser);

module.exports = router;