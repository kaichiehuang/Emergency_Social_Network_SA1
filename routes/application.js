const express = require('express');
const router = express.Router();

/* home page for logged in users . */
router.get('/', function(req, res, next) {
    /* istanbul ignore next */
    console.log(res.cookie());

    res.render('application', {
        title: 'ESN by team SA1'
    });
});

module.exports = router;
