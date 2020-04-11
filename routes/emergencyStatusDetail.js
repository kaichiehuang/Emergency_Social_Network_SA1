const express = require('express');
const router = express.Router();
const EmergencyStatusDetailController = require(__dirname + '/../controllers/EmergencyStatusDetailController');
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
const multer = require('multer');
const upload = multer({dest: 'pictures/'});

// application/json parser
const jsonParser = bodyParser.json();

// Require controller
const emergencyStatusDetailController = new EmergencyStatusDetailController();

// get method for getting status detail
router.get('/:userId', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.getEmergencyStatusDetail);

// put method for updating status detail 
router.put('/:userId', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.updateEmergencyStatusDetail);

// post method for add new pictures and description
router.post('/:userId',TokenServerClass.validateToken, jsonParser, upload.single('picture') ,emergencyStatusDetailController.addPictureAndDesciption);

// TODO: delete method for deleting pictures and description

// TODO: put method for updating picture description
router.put('/:userId/picture', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.updatePictureDescription);

module.exports = router;

