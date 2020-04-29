const express = require('express');
const router = new express.Router();
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage, limits: {fileSize: 5000000}});
const RBAC = require('../middleware/RBAC');
// application/json parser
const jsonParser = bodyParser.json();
const ResourceController = require(__dirname + '/../controllers/ResourceController');

const resourceController = new ResourceController();


// post create a Resource
router.post('/', TokenServerClass.validateToken, RBAC.validateUser, upload.single('resourceImage'), jsonParser, resourceController.registerResource);
// req.file is the `avatar` file
// req.body will hold the text fields, if there were any

// get method to obtain all resources
router.get('/', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, resourceController.getResource);


// get method, get a resource by id or all the resources
router.get('/:resourceId', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, resourceController.getResource);


module.exports = router;
