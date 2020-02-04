var express = require('express');
var router = express.Router();
const model = require('../model/model');
const UserModel = model.User;
const ObjectId = require('mongoose').Types.ObjectId;
const blacklist = require("the-big-username-blacklist");
const tokenMiddleWare = require("../middleware/token"); 

const {validateTokenMid,generateToken} = require  ("../middleware/tokenServer");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req, res) => {
  //TODO params check, user creation
  var check_usr = req.body.username;
  var check_pwd = req.body.password;
  if (check_usr.length >= 3 && blacklist.validate(check_usr) && check_pwd.length >= 4) {}



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

  let userId = 1;

  tokenMiddleWare.generateToken(userId,false)
      .then( generatedToken => {
        tokenMiddleWare.generateToken(userId,true)
            .then( genRefToken => {
              let jsonToken = {};
              jsonToken["tokens"] = [];
              jsonToken["tokens"].push({token:generatedToken });
              jsonToken["tokens"].push({ex_token:genRefToken });
              res.contentType('application/json');
              res.send(JSON.stringify(jsonToken));

              // res.header('Authorization','BEARER ' + data );
              // res.send(data);
            })
      })
      .catch(err => {
        res.send(err);
      });


});


router.put('/:userId',validateTokenMid, function(req, res, next) {
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
