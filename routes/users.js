var express = require('express');
var router = express.Router();
const UsersController = require(__dirname + '/../controllers/usersController');
var bodyParser = require('body-parser');
const { validateTokenMid } = require('../middleware/tokenServer');


// application/json parser
var jsonParser = bodyParser.json();

// Require controller
var usersController = new UsersController();

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

//post method for creating a user
router.post('/', jsonParser, usersController.createUser);
//put method for updating a user
router.put('/:userId', validateTokenMid, jsonParser, usersController.updateUser);


module.exports = router;
