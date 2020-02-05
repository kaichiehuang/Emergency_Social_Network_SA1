var express = require('express');
var router = express.Router();
const User = require('../model/user.js');
const ReservedNamesModel = require('../model/model').ReservedNamesMongo;
//const  = model.User;
const ObjectId = require('mongoose').Types.ObjectId;
const  blacklist = require("the-big-username-blacklist");


const {
    validateTokenMid
} = require("../middleware/tokenServer");

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

  //Validate BlackListUser\
  let black = blacklist.validate(signUpData["username"]);
  if(!black){
    return res.status(422).send({ msg: "User name banned"});
  }


  user_instance.validateUserName().then(function(result){
        return user_instance.validatePassword();
      }).then(function(result){
        return user_instance.registerUser();
      }).then(function(response){
        tokenMiddleWare.generateToken(response._id,false)
            .then( generatedToken => {
              tokenMiddleWare.generateToken(response._id,true)
                  .then( genRefToken => {
                    let jsonToken = {};
                    jsonToken["user"] = {
                    	userId:response._id,
                    	username:response.username,
                    	name:response.name
                    };
                    jsonToken["tokens"] = {
                    	token: generatedToken,
                    	ex_token: genRefToken
                    };


                    res.contentType('application/json');
                    res.status(201).send(JSON.stringify(jsonToken));
                  })
            })
            .catch(err => {
              res.status(500).send(err);
            });
      })
      .catch(err => {
        res.contentType('application/json');
        return res.status(422).send({msg: err.msg}).end();
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
