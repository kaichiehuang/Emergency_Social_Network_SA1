var express = require('express');
var router = express.Router();
const model = require('../model/model');
const UserModel = model.User;
const ObjectId = require('mongoose').Types.ObjectId;
var blacklist = require("the-big-username-blacklist");
var 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req, res) => {
  //TODO params check, user creation
  var check_usr = req.body.username;
  var check_pwd = req.body.password;
  if (check_usr.length >= 3 && blacklist.validate(check_usr) && check_pwd.length >= 4)



  console.log('begin to create');

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
  res.send('respond with a resource');
});

router.put('/:userId', function(req, res, next) {
  var userId = req.params.userId;
  //TODO token validation via middleware?
  console.log(userId);
  UserModel.findOne({_id: userId}, function(err, user){
    if(err) {
      console.log(err);
      res.send(500, {error: err});
    }
    console.log(user);
    user.acknowledgement = true;
    user.save();
  });
  //TODO jump to which view
  res.send('respond with a resource');
});

module.exports = router;
