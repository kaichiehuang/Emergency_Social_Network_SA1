const express = require('express');
const router = new express.Router();
const EmergencyStatusDetailController = require(__dirname + '/../controllers/EmergencyStatusDetailController');
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
const multer = require('multer');
const upload = multer({dest: 'public/pictures/'});
const RBAC = require('../middleware/RBAC');

// application/json parser
const jsonParser = bodyParser.json();

// Require controller
const emergencyStatusDetailController = new EmergencyStatusDetailController();

// get method for getting status detail
router.get('/:userId', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, emergencyStatusDetailController.getEmergencyStatusDetail);

// put method for updating status detail
router.put('/:userId', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, emergencyStatusDetailController.updateEmergencyStatusDetail);

// get method for getting all pictures and description
router.get('/picture/:userId', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, emergencyStatusDetailController.getAllPictureAndDescription);

// post method for add new pictures and description
router.post('/:userId', TokenServerClass.validateToken, RBAC.validateUser, upload.single('picture'), jsonParser, emergencyStatusDetailController.addPictureAndDescription);

// delete method for deleting pictures and description
router.delete('/picture/:pictureId', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, emergencyStatusDetailController.removePictureAndDescription);

// future use: put method for updating picture description
router.put('/picture/:pictureId', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, emergencyStatusDetailController.updatePictureDescription);

module.exports = router;

