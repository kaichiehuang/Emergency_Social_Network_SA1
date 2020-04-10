const express = require('express');
const router = express.Router();
const EmergencyStatusDetailController = require(__dirname + '/../controllers/EmergencyStatusDetailController');
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');

// application/json parser
const jsonParser = bodyParser.json();

// Require controller
const emergencyStatusDetailController = new EmergencyStatusDetailController();

// get method for getting status detail
router.get('/', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.getEmergencyStatusDetail);

// put method for updating status detail 
router.put('/:userId', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.updateEmergencyStatusDetail);

// post method for add new pictures and description
router.post('/', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.addPictureAndDesciption);

// TODO: delete method for deleting pictures and description

// TODO: put method for updating picture description
module.exports = router;

