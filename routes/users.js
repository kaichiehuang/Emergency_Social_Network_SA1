var express = require('express');
var router = express.Router();
const model = require('../model/model');
const UserModel = model.User;
const ObjectId = require('mongoose').Types.ObjectId;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  //TODO params check, user creation
  console.log('begin to create');
  console.log(req.body);
  console.log(req.body.username);
  console.log(req.body.password);

  const user_instance = new UserModel({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    last_name: req.body.last_name,
    acknowledgement: false
  });
  user_instance.save(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("user creation success");
  });
  //TODO return generated token
  res.redirect('/');
});

router.put('/', function(req, res, next) {
  console.log('into PUT');
  var userID = req.query.userID;
  //TODO token validation
  const validation = true;
  if (!validation) {
    res.redirect('/');
  }
  //save acknowldgmnt flag into DB
  UserModel.updateOne({ _id: new ObjectId(userID) }, {
    acknowledgement: true
  });
  console.log("user acknowledge success");
  //error handling
  //TODO return what?
  res.redirect('/');
});

module.exports = router;
