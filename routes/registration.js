const express = require('express');
const router = new express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    /* istanbul ignore next */
    res.render('signup', {});
});
module.exports = router;
