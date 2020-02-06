var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'ESN by team SA1'
    });
});
/* GET home page. */
router.get('/example', function(req, res, next) {
    res.render('example', {
        title: 'Example page'
    });
});
module.exports = router;