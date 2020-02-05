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

  let user_instance = new User(signUpData["username"],signUpData["password"],signUpData["name"],signUpData["last_name"]);

  //validations here
  let validationResult = user_instance.validate();
  if(!validationResult.res) {
    console.log(validationResult);
    return res.status(422).send({ msg: validationResult.msg});
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

    let userId = req.params.userId;
    console.log(userId);
    user_instance.updateKnowledge(userId,true)
        .then( _ => {
            //TODO jump to which view
            res.send('respond with a resource');
        })
        .catch(err => {
            res.send(err);
        });


});


module.exports = router;
