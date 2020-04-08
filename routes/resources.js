const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
// application/json parser
const jsonParser = bodyParser.json();
const ResourceController = require(__dirname + '/../controllers/ResourceController');

const resourceController = new ResourceController();


// post create a Resource
router.post('/', TokenServerClass.validateToken,upload.single('resourceImage'), jsonParser, resourceController.registerResource);
// req.file is the `avatar` file
// req.body will hold the text fields, if there were any

// get method to obtain all resources
router.get('/', TokenServerClass.validateToken, jsonParser,resourceController.getResource);


// get method, get a resource by id or all the resources
router.get('/:resourceId', TokenServerClass.validateToken, jsonParser, resourceController.getResource);


module.exports = router;
