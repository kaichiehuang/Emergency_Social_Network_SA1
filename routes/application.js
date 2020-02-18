var express = require('express');
var router = express.Router();

/* home page for logged in users . */
router.get('/', function(req, res, next) {

    console.log(res.cookie());

    res.render('application', {
        title: 'ESN by team SA1'
    });
});

module.exports = router;