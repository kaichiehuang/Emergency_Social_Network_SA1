var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const TokenServerClass = require("../middleware/TokenServer")
// application/json parser
var jsonParser = bodyParser.json();
const AnnouncementController = require(__dirname + '/../controllers/AnnouncementController');

var announcementController = new AnnouncementController();


//post method for creating an announcement
router.post('/', TokenServerClass.validateToken,jsonParser, announcementController.createAnnouncement);

//get method to obtain announcements (all or by keyword)
router.get('/', TokenServerClass.validateToken, jsonParser, announcementController.getAnnouncement);



module.exports = router;
