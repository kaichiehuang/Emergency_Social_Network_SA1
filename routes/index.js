var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
/* GET home page. */
router.get('/example', function(req, res, next) {
    res.render('example', {
        title: 'Express sdfsd fs'
    });
});
module.exports = router;