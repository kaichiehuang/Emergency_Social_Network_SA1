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
router.delete('/:userId/socket/:socketId', validateTokenMid, jsonParser, usersController.deleteSocket);
router.post('/:userId/socket', validateTokenMid, jsonParser, usersController.createSocket);
router.put('/:userId', validateTokenMid, jsonParser, usersController.updateUser);

//get method to obtain all users
router.get('/', validateTokenMid, jsonParser, usersController.getAllUsers);

/**
 * @swagger
 *
 * /users:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.get("/", validateTokenMid,jsonParser,usersController.getAllUsers);

router.get('/:userId', validateTokenMid, jsonParser, usersController.getUser);
//post method for creating a user
router.post('/', jsonParser, usersController.createUser);
//put method for updating a user

module.exports = router;
