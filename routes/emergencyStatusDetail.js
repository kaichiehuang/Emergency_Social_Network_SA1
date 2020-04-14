const express = require('express');
const router = express.Router();
const EmergencyStatusDetailController = require(__dirname + '/../controllers/EmergencyStatusDetailController');
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
const multer = require('multer');
const upload = multer({dest: 'public/pictures/'});

// application/json parser
const jsonParser = bodyParser.json();

// Require controller
const emergencyStatusDetailController = new EmergencyStatusDetailController();

// get method for getting status detail
router.get('/:userId', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.getEmergencyStatusDetail);

// put method for updating status detail 
router.put('/:userId', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.updateEmergencyStatusDetail);

//get method for getting all pictures and description
router.get('/picture/:userId', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.getAllPictureAndDescription);

// post method for add new pictures and description
router.post('/:userId',TokenServerClass.validateToken, upload.single('picture'),jsonParser,emergencyStatusDetailController.addPictureAndDescription);

//delete method for deleting pictures and description
router.delete('/picture/:pictureId', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.removePictureAndDescription);

//future use: put method for updating picture description
router.put('/picture/:pictureId', TokenServerClass.validateToken, jsonParser, emergencyStatusDetailController.updatePictureDescription);

module.exports = router;

