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

/* API Define:
* POST /users
* Content-Type: application/json
* Body:
* {
    "username": "kevin_durant",
    "password": "encrypted password",
    "name": "NAME",
    "last_name": "family name",
    "acknowledgement": false
  }
* */
router.post('/', (req, res) => {

  let signUpData = req.body;
  console.log(signUpData);


  var check_usr = req.body.username;
  var check_pwd = req.body.password;
  // if (check_usr.length >= 3 && blacklist.validate(check_usr) && check_pwd.length >= 4) {
  //
  // }

  console.log('begin to create');

  let user_instance = new User(signUpData["username"],signUpData["password"],signUpData["name"],signUpData["last_name"]);
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
                          res.status(201).send(JSON.stringify(jsonToken));
                      })
              })
              .catch(err => {
                  res.status(500).send(err);
              });
      });

});

/* API Define:
* PUT /users/{userId}
* Content-Type: application/json
* Body:
* {
    "acknowledgement": true
  }
* */
router.put('/:userId', validateTokenMid, function(req, res, next) {
    let user_instance = new User();
    let userId = req.params.userId;
    let acknowledgement = req.body.acknowledgement;
    console.log(userId);
    user_instance.updateKnowledge(userId, acknowledgement)
        .then( _ => {
            res.status(200).end();
        })
        .catch(err => {
            res.status(500).send(err);
        });
});


module.exports = router;
