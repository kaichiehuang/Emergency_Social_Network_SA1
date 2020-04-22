const express = require('express');
const router = new express.Router();
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
const jsonParser = bodyParser.json();
const SpamReportController = require('../controllers/SpamReportController');
const spamReportController = new SpamReportController();
const RBAC = require('../middleware/RBAC');

router.post('/', TokenServerClass.validateToken, RBAC.validateUser, jsonParser, spamReportController.createSpamReport);


module.exports = router;
