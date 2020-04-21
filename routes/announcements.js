const express = require('express');
const router = new express.Router();
const bodyParser = require('body-parser');
const TokenServerClass = require('../middleware/TokenServer');
// application/json parser
const jsonParser = bodyParser.json();
const AnnouncementController = require(__dirname + '/../controllers/AnnouncementController');

const announcementController = new AnnouncementController();


// post method for creating an announcement
router.post('/', TokenServerClass.validateToken, jsonParser, announcementController.createAnnouncement);

// get method to obtain announcements (all or by keyword)
router.get('/', TokenServerClass.validateToken, jsonParser, announcementController.getAnnouncements);


module.exports = router;
