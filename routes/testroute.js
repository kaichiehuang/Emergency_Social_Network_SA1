const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
const EmergencyStatusDetailController = require(__dirname + '/../controllers/EmergencyStatusDetailController');
const RBAC = require('../middleware/RBAC');
// Require controller
const emergencyStatusDetailController = new EmergencyStatusDetailController();




router.delete('/:userId', TokenServerClass.validateToken, RBAC.validateUser,emergencyStatusDetailController.getEmergencyStatusDetail);
router.post('/:userId', TokenServerClass.validateToken, RBAC.validateUser,emergencyStatusDetailController.getEmergencyStatusDetail);
router.put('/:userId', TokenServerClass.validateToken, RBAC.validateUser,emergencyStatusDetailController.getEmergencyStatusDetail);
router.get('/:userId', TokenServerClass.validateToken, RBAC.validateUser,emergencyStatusDetailController.getEmergencyStatusDetail);


module.exports = router;