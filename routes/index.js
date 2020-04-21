const express = require('express');
const router = new express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    /* istanbul ignore next */
    res.render('index', {
        title: 'ESN by team SA1'
    });
});
/* GET home page. */
router.get('/example', function(req, res, next) {
    /* istanbul ignore next */
    res.render('example', {
        title: 'Example page'
    });
});
module.exports = router;
