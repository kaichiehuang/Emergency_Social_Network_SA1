const express = require('express');
const router = new express.Router();


/* home page for logged in users . */
router.get('/', function(req, res, next) {
    /* istanbul ignore next */

    res.render('application', {
        title: 'ESN by team SA1'
    });
});

module.exports = router;
