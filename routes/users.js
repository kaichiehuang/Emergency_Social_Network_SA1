var express = require('express');
var router = express.Router();
const User = require('../model/user.js');
//const  = model.User;
const ObjectId = require('mongoose').Types.ObjectId;


const {
    validateTokenMid,
    generateToken
} = require("../middleware/tokenServer");

const blacklist = require("the-big-username-blacklist");
const tokenMiddleWare = require("../middleware/tokenServer");


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/*    */
router.post('/', (req, res) => {

  let signUpData = req.body;


  var check_usr = req.body.username;
  var check_pwd = req.body.password;
  // if (check_usr.length >= 3 && blacklist.validate(check_usr) && check_pwd.length >= 4) {
  //
  // }

  console.log('begin to create');

  let user_instance = new User("username","password","name","lastname");

  //validations here
  if(!user_instance.validate().res) {
    res.status(422).end();
  }



  user_instance.registerUser()
      .then( response => {
          console.log();
          tokenMiddleWare.generateToken(response._id,false)
              .then( generatedToken => {
                  tokenMiddleWare.generateToken(response._id,true)
                      .then( genRefToken => {
                          let jsonToken = {};
                          jsonToken["user"] = [];
                          jsonToken["user"].push({userId:response._id });
                          jsonToken["tokens"] = [];
                          jsonToken["tokens"].push({token:generatedToken });
                          jsonToken["tokens"].push({ex_token:genRefToken });
                          res.contentType('application/json');
                          res.send(JSON.stringify(jsonToken));

                      })
              })
              .catch(err => {
                  res.send(err);
              });
      });

});


router.put('/:userId', validateTokenMid, function(req, res, next) {
    let user_instance = new User();
    var userId = req.params.userId;

    //TODO token validation via middleware?
    console.log(userId);

    //TODO jump to which view
    res.send('respond with a resource');
});


module.exports = router;
