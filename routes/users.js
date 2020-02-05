var express = require('express');
var router = express.Router();
const User = require('../model/user.js');
const ReservedNamesModel = require('../model/model').ReservedNamesMongo;
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
    res.send('lala respond with a resource');
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
  let user_instance = new User(signUpData["username"], signUpData["password"], signUpData["name"],signUpData["last_name"]);

  //validations here
  let validationResult = user_instance.validate();
  if(!validationResult.res) {
    console.log(validationResult);
    res.contentType('application/json');
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
