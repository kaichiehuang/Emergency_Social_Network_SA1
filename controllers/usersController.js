const User = require('../model/user.js');
const ReservedNamesModel = require('../model/model').ReservedNamesMongo;
//const  = model.User;
const ObjectId = require('mongoose').Types.ObjectId;
const {
    validateTokenMid
} = require("../middleware/tokenServer");
const tokenMiddleWare = require("../middleware/tokenServer");


class UsersController {
    /**
     * [createUser description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createUser(req, res) {
        let signUpData = req.body;
        console.log(signUpData);

        //1. If no username or password in json set them with emtpy values
        if(signUpData["username"] == undefined){
            signUpData["username"] = "";
        }
        if(signUpData["password"] == undefined){
            signUpData["password"] = "";
        }

        //2. Create user object
        let user_instance = new User(signUpData["username"], signUpData["password"], signUpData["name"], signUpData["last_name"]);

        //3. Run validations on user object
        var result = user_instance.validate()
        .then(function(result) {
            return user_instance.registerUser();
        }).then(function(response) {
            tokenMiddleWare.generateToken(response._id, false).then(generatedToken => {
                tokenMiddleWare.generateToken(response._id, true).then(genRefToken => {
                    let jsonResponseData = {};
                    jsonResponseData["user"] = {
                        userId: response._id,
                        username: response.username,
                        name: response.name,
                        acknowledgement: response.acknowledgement
                    };
                    jsonResponseData["tokens"] = {
                        token: generatedToken,
                        ex_token: genRefToken
                    };
                    res.contentType('application/json');
                    return res.status(201).send(JSON.stringify(jsonResponseData));
                })
            }).catch(err => {
                return res.status(500).send(err);
            });
        }).catch(err => {
            res.contentType('application/json');
            return res.status(422).send({
                msg: err.msg
            }).end();
        });
    }
    /**
     * [updateUser description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    updateUser(req, res) {
        let user_instance = new User();
        let userId = req.params.userId;
        let acknowledgement = req.body.acknowledgement;
        console.log(userId);
        user_instance.updateKnowledge(userId, acknowledgement).then(usr => {
            let jsonResponseData = {};
            jsonResponseData["user"] = {
                userId: usr._id,
                username: usr.username,
                name: usr.name,
                acknowledgement: usr.acknowledgement
            };
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(jsonResponseData));
        }).catch(err => {
            return res.status(500).send(err);
        });
    }
}

module.exports = UsersController;